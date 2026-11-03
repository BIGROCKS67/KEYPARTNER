// Placeholder blocks shaped like the content they stand in for.
export function SkeletonLine({ width = '100%', height = 14, style }) {
  return <span className="skeleton" style={{ width, height, ...style }} aria-hidden />
}

export function JobCardSkeleton() {
  return (
    <div className="job-listing-card job-listing-card--skeleton" aria-hidden>
      <SkeletonLine width="38%" height={20} />
      <SkeletonLine width="72%" height={26} />
      <SkeletonLine width="94%" />
      <SkeletonLine width="60%" />
    </div>
  )
}
