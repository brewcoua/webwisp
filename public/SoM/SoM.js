class SoM {
    constructor() {
        this.elements = [];
        this.boxes = [];
    }

    display() {
        this.clear();

        // First, select all elements that are clickable by default, then add the ones that have an onClick event
        let elements = document.querySelectorAll('button, a, input, select, textarea');
        let onclickElements = Array.from(
            document.querySelectorAll('*')
        ).filter(element => element.onclick !== null ||
            // Check if the style for cursor is pointer
            window.getComputedStyle(element).cursor === 'pointer'
        );

        // Then, filter elements that are not visible, either because of style or because the window needs to be scrolled
        elements = Array.from(elements)
            .concat(onclickElements)
            .filter(element => {
                if (element.offsetWidth === 0 && element.offsetHeight === 0) {
                    return false;
                }
                const style = window.getComputedStyle(element);
                if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                    return false;
                }

                // Check if the element is in the viewport
                const rect = element.getBoundingClientRect();
                if (rect.top >= window.innerHeight || rect.bottom <= 0 || rect.left >= window.innerWidth || rect.right <= 0) {
                    return false;
                }

                return true;
            })
            .filter((element, index, self) => self.indexOf(element) === index);

        // Now, filter elements so that we only keep the ones that are not inside another clickable element
        elements = elements.filter((element, index) => {
            let parent = element.parentElement;
            while (parent !== null) {
                if (elements.includes(parent)) {
                    return false;
                }
                parent = parent.parentElement;
            }
            return true
        });

        const labels = [];
        const boundingBoxes = [];

        this.elements.push(...elements);

        elements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const div = document.createElement('div');
            div.style.left = `${rect.left}px`;
            div.style.top = `${rect.top}px`;
            div.style.width = `${rect.width}px`;
            div.style.height = `${rect.height}px`;
            div.classList.add('SoM');

            const randomColor = () => Math.floor(Math.random() * 256);
            const color = [randomColor(), randomColor(), randomColor()]

            div.style.backgroundColor = `rgba(${color.join(',')}, 0.5)`;

            const label = document.createElement('label');
            label.textContent = index;
            label.style.color = `rgb(${color.map(c => 255 - c).join(',')})`;
            label.style.backgroundColor = `rgba(${color.join(',')}, 0.5)`;

            div.appendChild(label);
            document.body.appendChild(div);

            const labelRect = label.getBoundingClientRect();

            const gridSize = 10;
            const positions = [];
            for (let i = 0; i <= gridSize; i++) {
                // Top side
                positions.push({
                    top: rect.top - labelRect.height,
                    left: rect.left + (rect.width / gridSize) * i - labelRect.width / 2
                });
                // Bottom side
                positions.push({top: rect.bottom, left: rect.left + (rect.width / gridSize) * i - labelRect.width / 2});
                // Left side
                positions.push({
                    top: rect.top + (rect.height / gridSize) * i - labelRect.height / 2,
                    left: rect.left - labelRect.width
                });
                // Right side
                positions.push({top: rect.top + (rect.height / gridSize) * i - labelRect.height / 2, left: rect.right});
            }

            // Calculate score for each position
            const scores = positions.map(position => {
                let score = 0;

                // Check if position is within bounds
                if (position.top < 0 || position.top + labelRect.height > window.innerHeight ||
                    position.left < 0 || position.left + labelRect.width > window.innerWidth) {
                    score += Infinity; // Out of bounds, set score to infinity
                } else {
                    // Calculate overlap with other labels and bounding boxes
                    labels.concat(boundingBoxes).forEach(existing => {
                        const overlapWidth = Math.max(0, Math.min(position.left + labelRect.width, existing.left + existing.width) - Math.max(position.left, existing.left));
                        const overlapHeight = Math.max(0, Math.min(position.top + labelRect.height, existing.top + existing.height) - Math.max(position.top, existing.top));
                        score += overlapWidth * overlapHeight; // Add overlap area to score
                    });
                }

                return score;
            });

            // Select position with lowest score
            const bestPosition = positions[scores.indexOf(Math.min(...scores))];

            // Set label position
            label.style.top = `${bestPosition.top - rect.top}px`;
            label.style.left = `${bestPosition.left - rect.left}px`;

            // Add the new label's position to the array
            labels.push({top: bestPosition.top, left: bestPosition.left, width: labelRect.width, height: labelRect.height});

            // Add the bounding box's position to the array
            boundingBoxes.push(rect);

            this.boxes.push(div);

            element.setAttribute('data-SoM', index);
        });
    }

    hide() {
        this.boxes.forEach(label => label.style.display = 'none');
    }

    clear() {
        this.elements.forEach(element => element.removeAttribute('data-SoM'));
        this.elements.length = 0;

        this.boxes.forEach(label => label.remove());
        this.boxes.length = 0;
    }
}

window.SoM = new SoM();