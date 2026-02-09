/**
 * Cube2Core - 二阶魔方逻辑内核
 */
const Cube2Core = {
    colors: {
        U: "#ffffff", D: "#ffff00",
        F: "#00aa00", B: "#0000ff",
        L: "#ff8800", R: "#ff0000"
    },

    state: {},

    reset() {
        ["U", "D", "F", "B", "L", "R"].forEach(f => {
            this.state[f] = Array(4).fill(f);
        });
    },

    rotFace(f) {
        const s = this.state[f];
        this.state[f] = [s[2], s[0], s[3], s[1]];
    },

    move(face) {
        const c = this.state;
        this.rotFace(face);

        switch (face) {
            case "U": {
                const tmp = [c.F[0], c.F[1]];
                [c.F[0], c.F[1]] = [c.R[0], c.R[1]];
                [c.R[0], c.R[1]] = [c.B[0], c.B[1]];
                [c.B[0], c.B[1]] = [c.L[0], c.L[1]];
                [c.L[0], c.L[1]] = tmp;
                break;
            }
            case "D": {
                const tmp = [c.F[2], c.F[3]];
                [c.F[2], c.F[3]] = [c.L[2], c.L[3]];
                [c.L[2], c.L[3]] = [c.B[2], c.B[3]];
                [c.B[2], c.B[3]] = [c.R[2], c.R[3]];
                [c.R[2], c.R[3]] = tmp;
                break;
            }
            case "L": {
                const tmp = [c.U[0], c.U[2]];
                [c.U[0], c.U[2]] = [c.B[3], c.B[1]];
                [c.B[3], c.B[1]] = [c.D[0], c.D[2]];
                [c.D[0], c.D[2]] = [c.F[0], c.F[2]];
                [c.F[0], c.F[2]] = tmp;
                break;
            }
            case "R": {
                const tmp = [c.U[1], c.U[3]];
                [c.U[1], c.U[3]] = [c.F[1], c.F[3]];
                [c.F[1], c.F[3]] = [c.D[1], c.D[3]];
                [c.D[1], c.D[3]] = [c.B[2], c.B[0]];
                [c.B[2], c.B[0]] = tmp;
                break;
            }
            case "F": {
                const tmp = [c.U[2], c.U[3]];
                [c.U[2], c.U[3]] = [c.L[3], c.L[1]];
                [c.L[3], c.L[1]] = [c.D[1], c.D[0]];
                [c.D[1], c.D[0]] = [c.R[0], c.R[2]];
                [c.R[0], c.R[2]] = tmp;
                break;
            }
            case "B": {
                const tmp = [c.U[0], c.U[1]];
                [c.U[0], c.U[1]] = [c.R[1], c.R[3]];
                [c.R[1], c.R[3]] = [c.D[3], c.D[2]];
                [c.D[3], c.D[2]] = [c.L[2], c.L[0]];
                [c.L[2], c.L[0]] = tmp;
                break;
            }
        }
    },

    apply(notation) {
        if (!notation) return;
        const face = notation[0];
        const times = notation.includes("2") ? 2 : notation.includes("'") ? 3 : 1;
        for (let i = 0; i < times; i++) this.move(face);
    },

    getScramble(len = 11) {
        const faces = ["U", "R", "F"];
        const mods = ["", "'", "2"];
        const scramble = [];
        let lastFace = "";

        while (scramble.length < len) {
            const move = faces[Math.floor(Math.random() * faces.length)];
            if (move === lastFace) continue;

            const mod = mods[Math.floor(Math.random() * 3)];
            scramble.push(move + mod);
            lastFace = move;
        }
        return scramble;
    }
};

export default Cube2Core;