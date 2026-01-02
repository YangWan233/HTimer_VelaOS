# 氢计时器 (HTimer) - VelaOS QuickApp

## 关于HTimer

- **模拟真实计时器**：
    - **计时锁**：长按准备，松开启动，有效防止误触。
    - **预览联动**：长按打乱公式区域即可呼出魔方 2D 展开图，实时查看打乱后的状态。
- **WCA 仿真逻辑**：支持 20 步随机打乱，尽可能符合WCA打乱规则。
- **美观界面**：计时器字体采用等宽字体，UI源于[@无源流沙](https://www.bandbbs.cn/members/23192/)。

---

## 快速上手

### 1. 开发


```

npm install
npm run start

```

### 2. 构建


```

npm run build
npm run release

```

### 3. 调试


```

npm run watch

```
### 4. 代码规范化配置
代码规范化可以帮助开发者在git commit前进行代码校验、格式化、commit信息校验

使用前提：必须先关联git

macOS or Linux

```

sh husky.sh

```

windows

```

./husky.sh

```

---

## TODO

1. 支持更多WCA项目的打乱与预览图支持
2. 创建分组
3. 历史成绩管理与分析

---

## 了解更多

你可以通过我们的[官方文档](https://iot.mi.com/vela/quickapp)熟悉和了解快应用。

```
