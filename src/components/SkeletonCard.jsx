function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-poster" />
      <div className="skeleton-body">
        <div className="skeleton-line long" />
        <div className="skeleton-line short" />
      </div>
    </div>
  )
}

export default SkeletonCard