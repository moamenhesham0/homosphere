function PropertyCardSkeleton() {
    return (
        <div className="flex flex-col bg-white rounded-xl overflow-hidden animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.8)] border border-stone-100">
            <div className="aspect-[4/3] bg-stone-100/50" />
            <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="h-8 w-1/3 bg-stone-100/80 rounded-md" />
                <div className="flex gap-4">
                    <div className="h-5 w-16 bg-stone-100/80 rounded-md" />
                    <div className="h-5 w-16 bg-stone-100/80 rounded-md" />
                    <div className="h-5 w-24 bg-stone-100/80 rounded-md" />
                </div>
                <div className="mt-auto">
                    <div className="h-5 w-3/4 bg-stone-100/80 rounded-md mb-2" />
                    <div className="h-4 w-1/2 bg-stone-100/80 rounded-md" />
                </div>
            </div>
        </div>
    );
}

export default PropertyCardSkeleton;