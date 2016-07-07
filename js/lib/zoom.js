const STYLE = document.body.style

export default class Zoom {
    constructor () {
        /**
         * The current zoom level (scale)
         */
        this.level = 1

        /**
         * The current mouse position, used for panning
         */
        this.mouseX = 0
        this.mouseY = 0

        /**
         * Timeout before pan is activated
         */
        this.panEngageTimeout = -1
        this.panUpdateInterval = -1

        /**
         * Check for transform support so that we can fallback otherwise
         */
        this.supportsTransforms = 'WebkitTransform' in STYLE ||
                                  'MozTransform' in STYLE ||
                                  'msTransform' in STYLE ||
                                  'OTransform' in STYLE ||
                                  'transform' in STYLE

        /**
         * The easing that will be applied when we zoom in/out
         */
        if (this.supportsTransforms) {
            STYLE.transition = 'transform 0.8s ease'
            STYLE.OTransition = '-o-transform 0.8s ease'
            STYLE.msTransition = '-ms-transform 0.8s ease'
            STYLE.MozTransition = '-moz-transform 0.8s ease'
            STYLE.WebkitTransition = '-webkit-transform 0.8s ease'
        }

        /**
         * Zoom out if the user hits escape
         */
        document.addEventListener('keyup', (event) => {
            if (this.level !== 1 && event.keyCode === 27) {
                this.out()
            }
        })

        /**
         * Monitor mouse movement for panning
         */
        document.addEventListener('mousemove', (event) => {
            if (this.level !== 1) {
                this.mouseX = event.clientX
                this.mouseY = event.clientY
            }
        })
    }

    /**
	 * Applies the CSS required to zoom in, prefers the use of CSS3
	 * transforms but falls back on zoom for IE.
	 *
	 * @param {Object} rect
	 * @param {Number} scale
	 */
    _magnify (rect, scale) {
        let scrollOffset = this._getScrollOffset()

		/**
		 * Ensure a width/height is set
		 */
        rect.width = rect.width || 1
        rect.height = rect.height || 1

        /**
         * Center the rect within the zoomed viewport
         */
        rect.x -= (window.innerWidth - (rect.width * scale)) / 2
        rect.y -= (window.innerHeight - (rect.height * scale)) / 2

        if (this.supportsTransforms) {
            if (scale === 1) {
                // Reset
                STYLE.transform = ''
                STYLE.OTransform = ''
                STYLE.msTransform = ''
                STYLE.MozTransform = ''
                STYLE.WebkitTransform = ''
            } else {
                // Scale
                let origin = scrollOffset.x + 'px ' + scrollOffset.y + 'px'
                let transform = 'translate(' + -rect.x + 'px,' + -rect.y + 'px) scale(' + scale + ')'

                STYLE.transformOrigin = origin
                STYLE.OTransformOrigin = origin
                STYLE.msTransformOrigin = origin
                STYLE.MozTransformOrigin = origin
                STYLE.WebkitTransformOrigin = origin

                STYLE.transform = transform
                STYLE.OTransform = transform
                STYLE.msTransform = transform
                STYLE.MozTransform = transform
                STYLE.WebkitTransform = transform
            }
        } else {
            if (scale === 1) {
                // Reset
                STYLE.position = ''
                STYLE.left = ''
                STYLE.top = ''
                STYLE.width = ''
                STYLE.height = ''
                STYLE.zoom = ''
            } else {
                // Scale
                STYLE.position = 'relative'
                STYLE.left = (-(scrollOffset.x + rect.x) / scale) + 'px'
                STYLE.top = (-(scrollOffset.y + rect.y) / scale) + 'px'
                STYLE.width = (scale * 100) + '%'
                STYLE.height = (scale * 100) + '%'
                STYLE.zoom = scale
            }
        }

        this.level = scale
    }

    /**
	 * Pan the document when the mosue cursor approaches the edges
	 * of the window.
	 */
    _pan () {
        let range = 0.12
        let rangeX = window.innerWidth * range
        let rangeY = window.innerHeight * range
        let scrollOffset = this._getScrollOffset()

        if (this.mouseY < rangeY) {
            // Up
            window.scroll(scrollOffset.x, scrollOffset.y - (1 - (this.mouseY / rangeY)) * (14 / this.level))
        } else if (this.mouseY > window.innerHeight - rangeY) {
            // Down
            window.scroll(scrollOffset.x, scrollOffset.y + (1 - (window.innerHeight - this.mouseY) / rangeY) * (14 / this.level))
        }

        if (this.mouseX < rangeX) {
            // Left
            window.scroll(scrollOffset.x - (1 - (this.mouseX / rangeX)) * (14 / this.level), scrollOffset.y)
        } else if (this.mouseX > window.innerWidth - rangeX) {
            // Right
            window.scroll(scrollOffset.x + (1 - (window.innerWidth - this.mouseX) / rangeX) * (14 / this.level), scrollOffset.y)
        }
    }

    _getScrollOffset () {
        return {
            x: window.scrollX !== undefined ? window.scrollX : window.pageXOffset,
            y: window.scrollY !== undefined ? window.scrollY : window.pageYOffset
        }
    }

    /**
     * Zooms in on either a rectangle or HTML element.
     *
     * @param {Object} options
     *   - element: HTML element to zoom in on
     *   OR
     *   - x/y: coordinates in non-transformed space to zoom in on
     *   - width/height: the portion of the screen to zoom in on
     *   - scale: can be used instead of width/height to explicitly set scale
     */
    to (options) {
        // Due to an implementation limitation we can't zoom in
        // to another element without zooming out first
        if (this.level !== 1) {
            return this.out()
        }

        options.x = options.x || 0
        options.y = options.y || 0

        // If an element is set, that takes precedence
        if (Boolean(options.element)) {
            // Space around the zoomed in element to leave on screen
            var padding = 20
            var bounds = options.element.getBoundingClientRect()

            options.x = bounds.left - padding
            options.y = bounds.top - padding
            options.width = bounds.width + (padding * 2)
            options.height = bounds.height + (padding * 2)
        }

        // If width/height values are set, calculate scale from those values
        if (options.width !== undefined && options.height !== undefined) {
            options.scale = Math.max(Math.min(window.innerWidth / options.width, window.innerHeight / options.height), 1)
        }

        if (options.scale > 1) {
            options.x *= options.scale
            options.y *= options.scale

            this._magnify(options, options.scale)

            if (options.pan !== false) {
                // Wait with engaging panning as it may conflict with the
                // zoom transition
                this.panEngageTimeout = setTimeout(() => {
                    this.panUpdateInterval = setInterval(this._pan, 1000 / 60)
                }, 800)
            }
        }
    }

    /**
     * Resets the document zoom state to its default.
     */
    out () {
        clearTimeout(this.panEngageTimeout)
        clearInterval(this.panUpdateInterval)
        this._magnify({ x: 0, y: 0 }, 1)
        this.level = 1
    }

    get zoomLevel () {
        return this.level
    }
}
