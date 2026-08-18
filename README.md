# 考公 / 考编备考工作台

一个**纯前端、零后端**的备考工作台，手机和电脑浏览器都能用，支持**多人各自注册账号、数据完全隔离互不干扰**。

## 功能模块

- 📋 **今日计划**：学习计时器 + 加入事项 + 完成打卡
- 📚 **事项库**：题本 / 网课一键加入今天
- ✍️ **题本进度**：完成率、均秒、正确率
- 🎬 **网课进度**：课时进度，可填 B 站链接
- ❌ **错题盘点**：拍照上传，按题本分组
- 📊 **总体分析**：科目时间分布环形图 + 近 30 天学习时长折线
- 📈 **每月分析**：本月时长 / 做题 / 错题 / 正确率 + 六大模块正确率条形
- ⚙️ **数据与设置**：账号、备份导入导出、数据自检、重置

## 在线地址（推荐，手机电脑通用）

**https://huangxiaohang123456-cyber.github.io/kaogong-workspace/**

手机上建议「添加到主屏幕」，即可像 App 一样全屏使用：
- iPhone：Safari 打开 → 分享 → 添加到主屏幕
- 安卓：Chrome 打开 → 菜单 → 安装应用 / 添加到主屏幕

---

## 怎么用

### 第一次打开
- 页面会自动弹出「登录 / 注册」窗口。
- 用**邮箱 + 密码**注册一个账号（密码至少 6 位）→ 注册完直接登录即可（无需去邮箱验证）。
- 首次登录会自动把你之前本机存的数据迁移进账号；之后换手机 / 电脑只要**用同一账号登录**，数据自动同步。

### 不想注册？也能用
- 登录窗口点「取消」或「仅本机模式」即可，数据只存在当前浏览器里，换设备不互通。

### 忘记密码
1. 登录窗口「登录」标签右下角点 **「忘记密码？」**。
2. 填入注册邮箱 → 系统发重置邮件。
3. 去邮箱点链接 → 自动回到页面弹出「设置新密码」框 → 设新密码 → 用新密码登录。

---

## 分享给别人（互不干扰）

直接把上面的**在线地址**发给朋友即可：
- 对方打开 → 注册自己的账号 → 各自独立空间，**数据互不可见、互不影响**。
- 不需要你帮忙配置任何东西；每个人用各自的邮箱密码登录，凭密码访问自己的数据。

## 隐私与安全

- 数据按账号隔离：数据库层用 Supabase **行级安全（RLS）** 策略，规则是「只允许已登录用户读写自己那一行」，别人即使拿到公钥也看不到你的内容。
- 密码由 Supabase 托管，不存明文。
- 未登录时数据只存本机浏览器，不上云。

---

## 部署者配置说明（已为你配置完成 ✅）

工作台已接好云端。下面是你（部署者）在 Supabase 后台已完成的关键配置，留作记录：

1. **新建项目**：Supabase 免费层项目 `gongzuotai`（东京节点）。
2. **建表 + 开权限隔离**：在 SQL Editor 执行 `supabase_auth.sql`（新建 `kg_users` 表 + RLS 策略）。
3. **关掉邮箱验证**：Authentication → Sign In / Providers → 关闭 "Confirm email"，让朋友注册完直接登录。
4. **配置跳转地址**：Authentication → URL Configuration
   - Site URL：`https://huangxiaohang123456-cyber.github.io/kaogong-workspace/`
   - Redirect URLs：同上（用于「忘记密码」邮件回链）。

> 若以后要把项目搬到自己的 Supabase 账号，改 `index.html` 顶部 `CONFIG`（supabaseUrl / supabaseKey）即可，其余逻辑不用动。

---

## 本地二次开发与部署

### 本地预览
双击 `index.html` 即可在浏览器打开（离线可用），数据存本机。

### 发布到 GitHub Pages
Git 直连推送在本机会超时，用 GitHub API 上传（已验证可用）：

```bash
cd kaogong-workspace
SHA=$(gh api repos/<你的用户名>/kaogong-workspace/contents/index.html --jq '.sha')
python -c "
import base64, json, sys
data=open('index.html','rb').read()
b64=base64.b64encode(data).decode('ascii')
payload={'message':'update','content':b64,'sha':sys.argv[1],'branch':'main'}
open('_p.json','w',encoding='utf-8').write(json.dumps(payload))
" "$SHA"
gh api --method PUT repos/<你的用户名>/kaogong-workspace/contents/index.html --input _p.json
rm -f _p.json
```

## 文件说明

| 文件 | 作用 |
|---|---|
| `index.html` | 主程序（单文件，含全部逻辑、样式与登录/注册/忘记密码） |
| `supabase_auth.sql` | 云端数据库建表 + RLS 权限隔离脚本 |
| `manifest.webmanifest` | PWA 配置，支持「添加到主屏幕」 |
| `sw.js` | Service Worker，离线缓存 |
| `icon.svg` | 主屏幕图标 |
