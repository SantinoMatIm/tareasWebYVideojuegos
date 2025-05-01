/*
 * Vector class for representing positions and velocities
 *
 * Based on the Pong game structure
 * 2025-04-29
 */

class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    times(factor) {
        return new Vec(this.x * factor, this.y * factor);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const len = this.length();
        if (len === 0) return new Vec(0, 0);
        return new Vec(this.x / len, this.y / len);
    }
}