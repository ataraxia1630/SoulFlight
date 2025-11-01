import { useCallback, useEffect, useRef, useState } from "react";

const useCarouselPagination = ({ itemsLength, itemsPerPage = 3, cardWidth = 193, gap = 0 }) => {
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalDots = Math.ceil(itemsLength / itemsPerPage);

  const scrollAmount = cardWidth * itemsPerPage + gap * (itemsPerPage - 1);

  const scrollToIndex = useCallback(
    (index) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      let scrollTarget;
      const isLastDot = index === totalDots - 1;

      if (isLastDot) {
        scrollTarget = container.scrollWidth - container.clientWidth;
      } else {
        scrollTarget = scrollAmount * index;
      }

      container.scrollTo({
        left: scrollTarget,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    },
    [scrollAmount, totalDots],
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const newIndex = Math.round(container.scrollLeft / scrollAmount);
      const clampedIndex = Math.max(0, Math.min(newIndex, totalDots - 1));
      setCurrentIndex(clampedIndex);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
      }
      ticking = true;
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [scrollAmount, totalDots]);

  return {
    scrollContainerRef,
    currentIndex,
    totalDots,
    scrollToIndex,
  };
};

export default useCarouselPagination;
