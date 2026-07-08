import { Link } from "react-router";
import {
  Heart,
  Bookmark,
  Eye,
  BookOpen,
  Star,
  Lock,
  Globe,
  Link2,
} from "lucide-react";
import { cn, formatNumber, formatRelativeTime, truncate, getInitials } from "../../lib/utils";
import type { FlashcardSet } from "../../types";

interface DeckCardProps {
  set: FlashcardSet;
  className?: string;
  compact?: boolean;
}

const COVER_GRADIENTS = [
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-purple-500",
  "from-pink-500 to-rose-500",
  "from-orange-500 to-amber-500",
  "from-green-500 to-emerald-500",
  "from-indigo-500 to-blue-500",
  "from-teal-500 to-cyan-500",
  "from-fuchsia-500 to-pink-500",
];

function getGradient(id: string): string {
  const index = id.charCodeAt(id.length - 1) % COVER_GRADIENTS.length;
  return COVER_GRADIENTS[index];
}

function VisibilityIcon({ visibility }: { visibility?: string }) {
  if (visibility === "private") return <Lock className="w-3 h-3" />;
  if (visibility === "link") return <Link2 className="w-3 h-3" />;
  return <Globe className="w-3 h-3" />;
}

export default function DeckCard({ set, className, compact = false }: DeckCardProps) {
  const gradient = getGradient(set._id);

  return (
    <Link
      to={`/sets/${set._id}`}
      className={cn(
        "group relative bg-card border border-border rounded-2xl overflow-hidden card-hover",
        "flex flex-col",
        className
      )}
    >
      {/* Cover */}
      <div className={cn(
        "relative overflow-hidden flex-shrink-0",
        compact ? "h-24" : "h-36"
      )}>
        {set.image ? (
          <img
            src={set.image}
            alt={set.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={cn("w-full h-full bg-gradient-to-br", gradient, "flex items-center justify-center")}>
            <BookOpen className="w-10 h-10 text-white/70" />
          </div>
        )}

        {/* Category badge */}
        {set.category && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/40 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            {set.category.name}
          </span>
        )}

        {/* Visibility */}
        <span className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-sm text-white rounded-full">
          <VisibilityIcon visibility={set.visibility} />
        </span>

        {/* Card count overlay */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/40 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          {set.totalCards} thẻ
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200 mb-1">
            {set.name}
          </h3>
          {!compact && set.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {truncate(set.description, 80)}
            </p>
          )}
        </div>

        {/* Author */}
        {set.author && (
          <div className="flex items-center gap-2 mb-3">
            {set.author.avatar ? (
              <img
                src={set.author.avatar}
                alt={set.author.name}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gradient-primary flex items-center justify-center text-white text-[9px] font-bold">
                {getInitials(set.author.name)}
              </div>
            )}
            <span className="text-xs text-muted-foreground truncate">{set.author.name}</span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className={cn("w-3.5 h-3.5", set.isLiked ? "fill-destructive text-destructive" : "")} />
            <span>{formatNumber(set.favoriteCount)}</span>
          </div>
          {set.viewCount !== undefined && (
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{formatNumber(set.viewCount)}</span>
            </div>
          )}
          {set.rating > 0 && (
            <div className="flex items-center gap-1 ml-auto">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span>{set.rating.toFixed(1)}</span>
            </div>
          )}
          {set.isBookmarked && (
            <Bookmark className="w-3.5 h-3.5 fill-primary text-primary ml-auto" />
          )}
        </div>

        {/* Tags */}
        {!compact && set.tags && set.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {set.tags.slice(0, 3).map((tag) => (
              <span
                key={tag._id}
                className="px-1.5 py-0.5 bg-muted text-muted-foreground text-[10px] rounded-md"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Updated time */}
        {!compact && (
          <p className="text-[10px] text-muted-foreground/60 mt-2">
            {formatRelativeTime(set.updatedAt)}
          </p>
        )}
      </div>
    </Link>
  );
}

// Skeleton version
export function DeckCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
      <div className={cn("animate-shimmer flex-shrink-0", compact ? "h-24" : "h-36")} />
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <div className="skeleton h-4 w-3/4 rounded" />
        {!compact && <div className="skeleton h-3 w-full rounded" />}
        {!compact && <div className="skeleton h-3 w-2/3 rounded" />}
        <div className="flex items-center gap-2 mt-1">
          <div className="skeleton w-5 h-5 rounded-full" />
          <div className="skeleton h-3 w-20 rounded" />
        </div>
        <div className="flex gap-3 mt-1">
          <div className="skeleton h-3 w-10 rounded" />
          <div className="skeleton h-3 w-10 rounded" />
        </div>
      </div>
    </div>
  );
}
