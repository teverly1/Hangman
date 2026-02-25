import confetti from 'canvas-confetti';

export function startConfettiCannon(frameRef,durationInSeconds = 15, colors = ['#4A90E2', '#2ecc71', '#f1c40f']) {
    const end = Date.now() + (durationInSeconds * 1000);

    if(frameRef)
    {
        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                // Update the ref directly so the component always has the latest ID
                frameRef.current = requestAnimationFrame(frame);
            }
        }());
    }
}