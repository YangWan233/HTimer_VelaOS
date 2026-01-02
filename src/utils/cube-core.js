// cube-core.js
const CubeCore = {
    colorMap: {
        U: "#fff", D: "#ff0",
        F: "#0a0", B: "#00f",
        L: "#f80", R: "#f00"
    },
    
    // 轴向映射：用于高效判断相对面冲突 (0: U/D, 1: L/R, 2: F/B)
    axisMap: { U: 0, D: 0, L: 1, R: 1, F: 2, B: 2 },
    
    state: {},

    reset() {
        ["U", "D", "F", "B", "L", "R"].forEach(f => {
            this.state[f] = Array(9).fill(f);
        });
    },

    rotFace(f) {
        const a = this.state[f];
        // 保持中心块 a[4] 不变
        this.state[f] = [a[6], a[3], a[0], a[7], a[4], a[1], a[8], a[5], a[2]];
    },

    move(face) {
        const c = this.state;
        this.rotFace(face);
        
        if (face === "U") {
            const tmp = [c.F[0], c.F[1], c.F[2]];
            [c.F[0], c.F[1], c.F[2]] = [c.R[0], c.R[1], c.R[2]];
            [c.R[0], c.R[1], c.R[2]] = [c.B[0], c.B[1], c.B[2]];
            [c.B[0], c.B[1], c.B[2]] = [c.L[0], c.L[1], c.L[2]];
            [c.L[0], c.L[1], c.L[2]] = tmp;
        } else if (face === "D") {
            const tmp = [c.F[6], c.F[7], c.F[8]];
            [c.F[6], c.F[7], c.F[8]] = [c.L[6], c.L[7], c.L[8]];
            [c.L[6], c.L[7], c.L[8]] = [c.B[6], c.B[7], c.B[8]];
            [c.B[6], c.B[7], c.B[8]] = [c.R[6], c.R[7], c.R[8]];
            [c.R[6], c.R[7], c.R[8]] = tmp;
        } else if (face === "L") {
            const tmp = [c.U[0], c.U[3], c.U[6]];
            [c.U[0], c.U[3], c.U[6]] = [c.B[8], c.B[5], c.B[2]];
            [c.B[8], c.B[5], c.B[2]] = [c.D[0], c.D[3], c.D[6]];
            [c.D[0], c.D[3], c.D[6]] = [c.F[0], c.F[3], c.F[6]];
            [c.F[0], c.F[3], c.F[6]] = tmp;
        } else if (face === "R") {
            const tmp = [c.U[2], c.U[5], c.U[8]];
            [c.U[2], c.U[5], c.U[8]] = [c.F[2], c.F[5], c.F[8]];
            [c.F[2], c.F[5], c.F[8]] = [c.D[2], c.D[5], c.D[8]];
            [c.D[2], c.D[5], c.D[8]] = [c.B[6], c.B[3], c.B[0]];
            [c.B[6], c.B[3], c.B[0]] = tmp;
        } else if (face === "F") {
            const tmp = [c.U[6], c.U[7], c.U[8]];
            [c.U[6], c.U[7], c.U[8]] = [c.L[8], c.L[5], c.L[2]];
            [c.L[8], c.L[5], c.L[2]] = [c.D[2], c.D[1], c.D[0]];
            [c.D[2], c.D[1], c.D[0]] = [c.R[0], c.R[3], c.R[6]];
            [c.R[0], c.R[3], c.R[6]] = tmp;
        } else if (face === "B") {
            const tmp = [c.U[0], c.U[1], c.U[2]];
            [c.U[0], c.U[1], c.U[2]] = [c.R[2], c.R[5], c.R[8]];
            [c.R[2], c.R[5], c.R[8]] = [c.D[8], c.D[7], c.D[6]];
            [c.D[8], c.D[7], c.D[6]] = [c.L[6], c.L[3], c.L[0]];
            [c.L[6], c.L[3], c.L[0]] = tmp;
        }
    },

    apply(m) {
        let t = m.includes("2") ? 2 : m.includes("'") ? 3 : 1;
        while (t--) this.move(m[0]);
    },

    /**
     * 高性能合规打乱算法
     * 解决了同面连续以及同轴面冲突（如 U D U）
     */
    getScramble(len = 20) {
        const f = ["U", "D", "L", "R", "F", "B"];
        const m = ["", "'", "2"];
        let r = [];
        let lastIdx = -1;
        let secondLastIdx = -1;

        while (r.length < len) {
            let idx = Math.floor(Math.random() * 6);
            let face = f[idx];

            // 1. 过滤同面 (防止 U U)
            if (idx === lastIdx) continue;

            // 2. 过滤同轴相对面冲突 (防止 U D U)
            if (secondLastIdx !== -1) {
                if (this.axisMap[face] === this.axisMap[f[lastIdx]] && idx === secondLastIdx) {
                    continue;
                }
            }

            r.push(face + m[Math.floor(Math.random() * 3)]);
            secondLastIdx = lastIdx;
            lastIdx = idx;
        }
        return r;
    }
};

export default CubeCore;