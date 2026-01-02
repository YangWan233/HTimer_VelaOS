import CubeCore from './cube-core.js';

const Solver = {
    rev: {"U":"U'","U'":"U","U2":"U2","D":"D'","D'":"D","D2":"D2","L":"L'","L'":"L","L2":"L2","R":"R'","R'":"R","R2":"R2","F":"F'","F'":"F","F2":"F2","B":"B'","B'":"B","B2":"B2"},
    moves: ["U", "D", "L", "R", "F", "B", "U'", "D'", "L'", "R'", "F'", "B'", "U2", "D2", "L2", "R2", "F2", "B2"],

    getH(state) {
        let count = 0;
        const dColor = state.D[4];
        if (state.D[1] !== dColor || state.F[7] !== state.F[4]) count++;
        if (state.D[3] !== dColor || state.L[7] !== state.L[4]) count++;
        if (state.D[5] !== dColor || state.R[7] !== state.R[4]) count++;
        if (state.D[7] !== dColor || state.B[7] !== state.B[4]) count++;
        return (count + 1) >> 1;
    },

    async solve(initialState, onProgress) {
        for (let limit = 0; limit <= 8; limit++) {
            if (onProgress) onProgress(limit);
            // 每一个新深度开始，给 UI 50ms 渲染时间
            await new Promise(r => setTimeout(r, 50));

            const result = await this.iterativeAStar(initialState, limit);
            if (result) return result;
        }
        return ["未找到解"];
    },

    // 非递归、带异步切片的 IDA*
    async iterativeAStar(state, limit) {
        // 栈节点：{ lastFace, moveIdx, g }
        // 我们可以通过 path 来回溯状态，不需要存储 state 副本
        let stack = [{ lastFace: "", moveIdx: 0, g: 0 }];
        let path = [];
        let nodeCount = 0;

        while (stack.length > 0) {
            let curr = stack[stack.length - 1];
            
            // --- 核心：每 200 个节点强制休眠，防止手表卡死 ---
            nodeCount++;
            if (nodeCount % 200 === 0) {
                await new Promise(r => setTimeout(r, 10)); 
            }

            // 检查当前状态是否达标
            const h = this.getH(state);
            if (h === 0) return path;

            // 剪枝
            if (curr.g + h > limit || curr.moveIdx >= 18) {
                // 回溯：如果当前层尝试完了，退回上一层并撤销动作
                stack.pop();
                if (path.length > 0) {
                    const lastMove = path.pop();
                    CubeCore.apply(this.rev[lastMove], state);
                }
                continue;
            }

            // 尝试下一个动作
            const m = this.moves[curr.moveIdx];
            curr.moveIdx++; // 标记当前层下一个要试的动作索引

            const face = m[0];
            // 剪枝：同面或相对面
            if (face === curr.lastFace) continue;
            if ((curr.lastFace === 'D' && face === 'U') || 
                (curr.lastFace === 'R' && face === 'L') || 
                (curr.lastFace === 'B' && face === 'F')) continue;

            // 应用动作，进入下一层
            CubeCore.apply(m, state);
            path.push(m);
            stack.push({ lastFace: face, moveIdx: 0, g: curr.g + 1 });
        }
        return null;
    }
};

export default Solver;