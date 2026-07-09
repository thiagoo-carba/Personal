const biblioteca = document.querySelector(".biblioteca");

if (biblioteca) {
    const scrollbar = document.createElement("div");
    scrollbar.className = "biblioteca-scrollbar";
    document.body.appendChild(scrollbar);

    const updateScrollbar = () => {
        const rect = biblioteca.getBoundingClientRect();
        const padding = 14;
        const trackHeight = rect.height - padding * 2;
        const scrollableHeight = biblioteca.scrollHeight - biblioteca.clientHeight;

        if (scrollableHeight <= 0) {
            scrollbar.classList.remove("visible");
            return;
        }

        const thumbHeight = Math.max(
            28,
            (biblioteca.clientHeight / biblioteca.scrollHeight) * trackHeight
        );
        const maxThumbTop = trackHeight - thumbHeight;
        const scrollProgress = biblioteca.scrollTop / scrollableHeight;

        scrollbar.style.left = `${rect.right - 7}px`;
        scrollbar.style.top = `${rect.top + padding + scrollProgress * maxThumbTop}px`;
        scrollbar.style.height = `${thumbHeight}px`;
    };

    biblioteca.addEventListener("mouseenter", () => {
        updateScrollbar();
        scrollbar.classList.add("visible");
    });

    biblioteca.addEventListener("mouseleave", () => {
        scrollbar.classList.remove("visible");
    });

    biblioteca.addEventListener("scroll", updateScrollbar);
    window.addEventListener("resize", updateScrollbar);

    updateScrollbar();
}
