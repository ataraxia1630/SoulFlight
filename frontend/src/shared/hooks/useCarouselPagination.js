import { useCallback, useEffect, useRef, useState } from "react";

const useCarouselPagination = ({ itemsLength, itemsPerPage = 3, cardWidth = 280 }) => {
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalDots = Math.ceil(itemsLength / itemsPerPage);

  const scrollToIndex = useCallback(
    (index) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollAmount = cardWidth * itemsPerPage;
      container.scrollTo({
        left: scrollAmount * index,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    },
    [cardWidth, itemsPerPage],
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollAmount = cardWidth * itemsPerPage;
      const newIndex = Math.round(container.scrollLeft / scrollAmount);
      setCurrentIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [cardWidth, itemsPerPage]);

  return {
    scrollContainerRef,
    currentIndex,
    totalDots,
    scrollToIndex,
  };
};

export default useCarouselPagination;
