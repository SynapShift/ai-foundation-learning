(function () {
  const lesson = (summary, why, points, formula, question, options, answer, feedback, sandbox) => ({
    summary, why, points, formula, question, options, answer, feedback, sandbox
  });

  const tracks = [
    { id: "llm", code: "LLM", name: "语言模型", kicker: "LLM CORE", title: "Transformer 认知主线", description: "从 hidden state 到逐 token 生成", color: "#59d2df", soft: "rgba(89,210,223,.12)" },
    { id: "image", code: "IMG", name: "图像生成", kicker: "IMAGE MODELS", title: "从像素到生成过程", description: "VAE、Diffusion 与 DiT", color: "#edc45a", soft: "rgba(237,196,90,.12)" },
    { id: "video", code: "VID", name: "视频生成", kicker: "VIDEO MODELS", title: "时间与运动建模", description: "时空表示与一致性", color: "#ef8472", soft: "rgba(239,132,114,.12)" },
    { id: "agent", code: "AGT", name: "Agent 系统", kicker: "AGENT SYSTEMS", title: "模型如何真正完成任务", description: "工具、状态与 Harness", color: "#6fd3a1", soft: "rgba(111,211,161,.12)" }
  ];

  const nodes = [
    {
      id: "embedding", track: "llm", code: "01", title: "Token 与 Embedding", subtitle: "文本进入模型", x: 55, y: 300, deps: [], level: "基础", minutes: 12,
      lesson: lesson(
        "模型不能直接处理文字，必须先把 token 变成可以计算的向量。",
        "后面的 Attention、FFN 和 lm_head 都在处理向量。先认清输入，数据流才不会断。",
        ["Tokenizer 把文本切成 token，并为每个 token 分配整数 ID。", "Embedding 表把 ID 映射成 hidden state 向量。", "向量不是词义字典，而是训练中逐渐形成的可计算表示。"],
        "token id -> embedding lookup -> hidden state\nshape: [sequence] -> [sequence, hidden_dim]",
        "Embedding 层直接输出的是什么？",
        ["一段自然语言", "每个 token 的 hidden-state 向量", "词表中的最终概率"], 1,
        "Embedding 的输出仍是隐藏向量。它会继续经过许多 Transformer block。",
        "任选一句短句，写出你认为 tokenizer 和 embedding 分别做了什么。"
      )
    },
    {
      id: "attention", track: "llm", code: "02", title: "Attention", subtitle: "跨 token 交换信息", x: 255, y: 300, deps: ["embedding"], level: "基础", minutes: 15,
      lesson: lesson(
        "Attention 让每个 token 根据当前上下文，有选择地读取其他 token 的信息。",
        "单个 token 的初始向量不知道句中其他位置发生了什么，语言理解需要跨位置的信息交换。",
        ["每个位置都会发起一次查询。", "相关性高的位置获得更大权重。", "加权汇总后，该位置得到带有上下文的新表示。"],
        "scores -> softmax -> weights\noutput = weights @ V",
        "Transformer block 中，哪个模块主要负责不同 token 之间交换信息？",
        ["Attention", "FFN", "lm_head"], 0,
        "Attention 负责跨 token 取信息；FFN 主要在每个 token 位置内部加工。",
        "用一句话解释：为什么“银行”这个 token 需要看上下文才能确定含义？"
      )
    },
    {
      id: "qkv", track: "llm", code: "03", title: "Q / K / V", subtitle: "查询、匹配、取信息", x: 455, y: 105, deps: ["attention"], level: "核心", minutes: 18,
      lesson: lesson(
        "同一个 hidden state 被投影成 Q、K、V 三种功能表示。",
        "匹配关系和真正传递的信息不是同一件事，分开表示能让模型学习更灵活的路由方式。",
        ["Q 表示当前位置想找什么。", "K 表示每个位置能用什么特征被匹配。", "V 携带被注意力权重汇总的信息。"],
        "Q = XWq, K = XWk, V = XWv\nQK 决定看谁，V 决定拿什么。",
        "如果 Q 和 K 负责相关性判断，真正被加权汇总的是什么？",
        ["token ID", "V 向量", "词表概率"], 1,
        "权重最终乘在 V 上。V 仍是 hidden-state 空间里的信息向量。",
        "给 Q、K、V 各写一句不超过 12 字的功能说明。"
      )
    },
    {
      id: "scaling", track: "llm", code: "04", title: "Score Scaling", subtitle: "控制点积尺度", x: 455, y: 300, deps: ["qkv"], level: "核心", minutes: 15,
      lesson: lesson(
        "QK 点积除以 sqrt(head_dim)，避免维度变大后 softmax 过早变得极端。",
        "如果少数分数压倒一切，梯度和信息路由都会变得不稳定。",
        ["维度增大时，点积的典型尺度也会增大。", "缩放发生在 attention softmax 之前。", "这是 score scaling，不是普通向量归一化。"],
        "scores = (Q @ K^T) / sqrt(head_dim)",
        "除以 sqrt(head_dim) 最准确的作用是什么？",
        ["把每个向量长度强制变成 1", "控制 attention logits 的尺度", "把 hidden state 变成概率"], 1,
        "它调节 softmax 前的分数尺度，并不执行常见的向量归一化。",
        "假设所有 QK 分数同时放大 10 倍，描述 softmax 权重会怎样变化。"
      )
    },
    {
      id: "attention-softmax", track: "llm", code: "05", title: "Attention Softmax", subtitle: "分配上下文权重", x: 655, y: 205, deps: ["scaling"], level: "核心", minutes: 14,
      lesson: lesson(
        "Attention softmax 把当前 token 对上下文各位置的分数变成总和为 1 的权重。",
        "模型需要一个平滑、可训练的方式决定每个位置读取多少信息。",
        ["softmax 的对象是上下文位置。", "高分位置权重大，但其他位置仍可保留少量权重。", "这里还没有进入词表，也没有得到下一个 token 概率。"],
        "weights = softmax(scores, dim=context_positions)",
        "Attention softmax 的权重分布在哪个集合上？",
        ["词表中的所有 token", "当前上下文的 token 位置", "模型的所有层"], 1,
        "这里是在上下文位置之间分配读取权重；词表概率要等到最终 lm_head 之后。",
        "写出 Attention softmax 与最终 vocabulary softmax 的一句话区别。"
      )
    },
    {
      id: "value-aggregation", track: "llm", code: "06", title: "Value Aggregation", subtitle: "把信息汇总回来", x: 855, y: 205, deps: ["attention-softmax"], level: "核心", minutes: 12,
      lesson: lesson(
        "得到权重后，对所有 V 做加权求和，形成当前位置的新上下文表示。",
        "相关性判断只有真正作用到信息向量上，才会改变模型正在处理的内容。",
        ["每个权重乘对应位置的 V。", "所有加权 V 相加，输出维度仍是 hidden dimension。", "输出是新的 hidden state，不是文字。"],
        "output_i = sum_j weight(i,j) * V_j",
        "Attention 的输出为什么仍是一个向量？",
        ["因为它是 V 向量的加权和", "因为 V 保存词表概率", "因为 tokenizer 会再次运行"], 0,
        "V 是 hidden-state value 向量，它们的加权和自然仍在向量空间中。",
        "权重 [0.25, 0.75]，V1=[4,0]，V2=[0,4]。手算输出。"
      )
    },
    {
      id: "output-head", track: "llm", code: "07", title: "lm_head 与 Logits", subtitle: "从向量回到词表", x: 855, y: 350, deps: ["value-aggregation"], level: "边界", minutes: 16,
      lesson: lesson(
        "只有最后的 hidden state 经过 lm_head，才会得到词表中每个 token 的 logits。",
        "这条边界能避免把中间向量、Attention 权重和最终 token 概率混为一谈。",
        ["Transformer blocks 持续产生和更新 hidden state。", "lm_head 是从 hidden dimension 到 vocabulary size 的线性映射。", "最终 softmax 再把 vocabulary logits 变成概率。"],
        "hidden state --lm_head--> vocabulary logits\nlogits --softmax--> token probabilities",
        "把最终 hidden state 映射到词表 logits 的模块是？",
        ["Tokenizer", "lm_head", "Attention softmax"], 1,
        "lm_head 把模型内部向量翻译成每个词表项的分数。",
        "用箭头写出 hidden state、lm_head、logits、softmax、probability 的顺序。"
      )
    },
    {
      id: "temperature", track: "llm", code: "08A", title: "Temperature", subtitle: "控制输出分布锋利度", x: 925, y: 485, deps: ["output-head"], level: "推理", minutes: 12,
      lesson: lesson(
        "Temperature 在最终 softmax 前缩放词表 logits，控制采样更稳定还是更多样。",
        "相同模型可以根据任务需要，选择保守输出或探索更多低概率选项。",
        ["低温让差距放大，分布更尖锐。", "高温让差距缩小，分布更平坦。", "Temperature 改变采样分布，不会重新训练模型。"],
        "probabilities = softmax(logits / temperature)",
        "降低 temperature 通常会怎样？",
        ["输出更随机", "高分 token 更占优势", "hidden dimension 变小"], 1,
        "低温会让已有 logit 差距在 softmax 中体现得更强，输出更确定。",
        "分别给“代码补全”和“创意写作”选择偏低或偏高温度，并说明原因。"
      )
    },
    {
      id: "transformer-block", track: "llm", code: "08B", title: "Transformer Block", subtitle: "完整 block 数据流", x: 655, y: 425, deps: ["output-head"], level: "结构", minutes: 18,
      lesson: lesson(
        "Attention 只是一个 Transformer block 的一部分；完整 block 还包含残差、归一化和 FFN。",
        "理解整个 block，才能知道 hidden state 如何在几十层中持续流动而不丢失原始信息。",
        ["Attention 负责跨 token 交换信息。", "FFN 在每个 token 位置独立加工信息。", "Residual 保留输入通路，Norm 控制数值尺度。"],
        "hidden state\n -> Attention -> Residual/Norm\n -> FFN       -> Residual/Norm\n -> next hidden state",
        "哪个说法最准确？",
        ["Attention 就是整个 Transformer block", "Attention 跨 token 取信息，FFN 对每个位置做内部加工", "FFN 负责从词表中采样"], 1,
        "一个 block 是多种机制的组合。Attention 管跨位置通信，FFN 管逐位置变换。",
        "把一个 block 想成团队协作：分别给 Attention、FFN、Residual、Norm 安排一个角色。"
      )
    },
    {
      id: "residual", track: "llm", code: "09", title: "Residual", subtitle: "保留原始信息通路", x: 420, y: 560, deps: ["transformer-block"], level: "结构", minutes: 13,
      lesson: lesson(
        "Residual connection 把子模块输入直接加回输出，让信息和梯度都有一条短路通道。",
        "深层网络若每层都完全重写表示，训练会困难，也更容易损失已有信息。",
        ["子模块学习的是对当前表示的增量修改。", "原始 hidden state 可以绕过子模块。", "残差连接不等于复制层，它是一条加法通路。"],
        "y = x + sublayer(x)",
        "Residual connection 最核心的形式是？",
        ["y = sublayer(x)", "y = x + sublayer(x)", "y = softmax(x)"], 1,
        "把 x 加回来，子层只需学习应该增加或修正什么。",
        "如果 sublayer(x) 接近 0，Residual 输出会怎样？这对深层堆叠有什么好处？"
      )
    },
    {
      id: "normalization", track: "llm", code: "10", title: "LayerNorm / RMSNorm", subtitle: "稳定表示尺度", x: 655, y: 590, deps: ["transformer-block"], level: "结构", minutes: 16,
      lesson: lesson(
        "Norm 控制每个 token 表示的数值尺度，让深层堆叠更稳定。",
        "几十层连续变换会让激活尺度漂移，影响训练和信息流。",
        ["LayerNorm 会中心化并缩放；RMSNorm 主要依据均方根缩放。", "现代 LLM 常使用 RMSNorm。", "Norm 处理 hidden state，不是 Attention score scaling。"],
        "RMSNorm(x) = x / RMS(x) * weight",
        "哪一个属于 hidden state 的归一化模块？",
        ["除以 sqrt(head_dim)", "RMSNorm", "Temperature"], 1,
        "RMSNorm 直接调整 hidden state 的尺度；另外两者调的是 softmax 前的分数。",
        "比较 score scaling 与 RMSNorm：它们分别作用在哪个对象上？"
      )
    },
    {
      id: "ffn", track: "llm", code: "11", title: "FFN 与 SwiGLU", subtitle: "逐 token 内部加工", x: 875, y: 590, deps: ["residual", "normalization"], level: "结构", minutes: 20,
      lesson: lesson(
        "FFN 对每个 token 独立执行非线性变换，扩展并重组 Attention 取回的信息。",
        "Attention 擅长路由信息，但模型还需要在每个位置内部形成更复杂的特征。",
        ["同一个 FFN 参数应用在所有 token 位置。", "中间维度通常比 hidden dimension 更大。", "SwiGLU 用门控方式控制哪些特征通过。"],
        "FFN(x) = W_down(activation(W_up(x)))",
        "FFN 在序列位置之间直接交换信息吗？",
        ["会，它重新计算 Attention", "不会，它对每个 token 位置独立处理", "只有训练时会"], 1,
        "跨 token 通信由 Attention 完成；FFN 在每个位置使用相同网络独立变换。",
        "解释为什么 Transformer 同时需要 Attention 和 FFN，而不是只保留一个。"
      )
    },
    {
      id: "autoregressive", track: "llm", code: "12", title: "自回归生成", subtitle: "一个 token 接一个 token", x: 875, y: 690, deps: ["ffn", "temperature"], level: "推理", minutes: 18,
      lesson: lesson(
        "LLM 每一步只预测下一个 token，再把新 token 接回上下文继续预测。",
        "这解释了为什么生成是循环过程，以及 causal mask、KV Cache 为什么重要。",
        ["Prefill 处理已有提示词。", "Decode 阶段逐 token 生成。", "每次采样结果都会影响后续上下文。"],
        "context -> logits -> sample token -> append -> repeat",
        "自回归生成每一步直接预测什么？",
        ["整篇文章", "下一个 token 的分布", "下一层的全部参数"], 1,
        "模型每一步产生下一个 token 的概率分布，采样后进入下一轮。",
        "模拟三轮生成循环，只写出每轮输入上下文如何变长。"
      )
    },

    {
      id: "image-representation", track: "image", code: "I1", title: "图像表示", subtitle: "像素、张量与特征", x: 70, y: 330, deps: [], level: "基础", minutes: 14,
      lesson: lesson("图像首先是带有空间结构的数值张量。", "生成模型操作的不是抽象的‘画面’，而是像素或压缩后的特征。", ["RGB 图像常表示为 H×W×3。", "模型通常会调整到固定范围。", "空间邻近关系是视觉建模的重要先验。"], "image shape: [channels, height, width]", "一张 RGB 图像最基础的数值表示是什么？", ["二维文字列表", "带通道和空间维度的张量", "词表概率"], 1, "图像是包含通道、高度和宽度的数值张量。", "描述一张 512×512 RGB 图像包含哪些维度。")
    },
    {
      id: "vae", track: "image", code: "I2", title: "VAE 与 Latent", subtitle: "压缩视觉空间", x: 280, y: 235, deps: ["image-representation"], level: "核心", minutes: 20,
      lesson: lesson("VAE 把高维像素压缩成 latent，再把 latent 解码回图像。", "直接在大图像像素上生成代价很高，latent space 提供更紧凑的工作空间。", ["Encoder：图像到 latent。", "Decoder：latent 到图像。", "压缩会保留主要视觉结构，也可能丢失细节。"], "image --encoder--> latent --decoder--> image", "Latent diffusion 为什么使用 VAE？", ["把文字切成 token", "降低生成空间的计算成本", "替代所有 Attention"], 1, "VAE 让扩散过程在更小的 latent 空间中运行。", "用‘压缩文件’类比 VAE，并指出这个类比不严格的地方。")
    },
    {
      id: "diffusion", track: "image", code: "I3", title: "Diffusion", subtitle: "从噪声逐步还原", x: 500, y: 330, deps: ["vae"], level: "核心", minutes: 22,
      lesson: lesson("Diffusion 学习如何从含噪表示中逐步预测并移除噪声。", "把复杂的一步生成拆成许多小步修正，训练目标更稳定。", ["训练时给真实样本加噪。", "模型学习预测噪声或等价目标。", "生成时从随机噪声逐步得到结构。"], "x_t -> denoiser -> estimate -> x_(t-1)", "Diffusion 生成通常从什么开始？", ["空白字符串", "随机噪声", "完整清晰图像"], 1, "采样从随机噪声开始，通过多步去噪形成图像。", "把扩散采样比作雕刻，说明每一步在修改什么。")
    },
    {
      id: "conditioning", track: "image", code: "I4", title: "Conditioning 与 CFG", subtitle: "让生成听懂要求", x: 700, y: 210, deps: ["diffusion"], level: "控制", minutes: 18,
      lesson: lesson("Conditioning 把文本等控制信号注入生成过程，CFG 调整遵循条件的强度。", "没有条件，模型只会从数据分布中随机采样，无法按提示词生成。", ["文本编码器产生条件表示。", "Cross-Attention 常用来注入文本条件。", "CFG 过高可能损失自然度或产生伪影。"], "guided = uncond + scale * (cond - uncond)", "CFG scale 提高通常意味着什么？", ["更强地遵循条件，但可能牺牲自然度", "一定提高分辨率", "缩短提示词"], 0, "更高 guidance 强化条件方向，但不是越高越好。", "为同一提示词设计低 CFG 与高 CFG 可能出现的差异。")
    },
    {
      id: "dit", track: "image", code: "I5", title: "DiT", subtitle: "Transformer 做去噪器", x: 700, y: 430, deps: ["diffusion"], level: "架构", minutes: 20,
      lesson: lesson("DiT 使用 Transformer 处理图像 latent patch，替代传统 U-Net 去噪器。", "Transformer 的可扩展性和统一序列建模能力适合更大的生成模型。", ["Latent 被切成 patch token。", "时间步和条件会注入网络。", "输出用于预测噪声、速度或其他训练目标。"], "latent patches + timestep + condition -> Transformer", "DiT 中的 token 通常来自什么？", ["词表中的文字 token", "图像 latent patch", "浏览器缓存"], 1, "DiT 把视觉 latent 切成 patch，并把它们作为序列处理。", "比较 LLM token 与 DiT patch token：相似点和不同点各写一个。")
    },
    {
      id: "flow-matching", track: "image", code: "I6", title: "Flow Matching", subtitle: "学习连续运输方向", x: 915, y: 330, deps: ["conditioning", "dit"], level: "进阶", minutes: 24,
      lesson: lesson("Flow Matching 学习一个随时间变化的速度场，把简单分布连续运输到数据分布。", "它提供了与 diffusion 相邻但不同的生成视角，并可能支持更直接的采样路径。", ["模型预测当前位置应该往哪里移动。", "训练目标常与路径上的速度有关。", "Rectified Flow 倾向让运输路径更直。"], "dx/dt = v_theta(x, t, condition)", "Flow Matching 模型主要学习什么？", ["词表大小", "随时间变化的速度场", "固定像素模板"], 1, "核心对象是速度场，它描述样本在连续时间中的移动方向。", "用地图导航类比速度场，并说明时间 t 的作用。")
    },

    {
      id: "video-representation", track: "video", code: "V1", title: "视频表示", subtitle: "图像再加时间轴", x: 80, y: 330, deps: ["image-representation"], level: "基础", minutes: 14,
      lesson: lesson("视频是在空间维度之外再增加时间维度的信号。", "视频模型不仅要画好每一帧，还要保证相邻帧的运动和身份连续。", ["基本形状包含 time、height、width、channels。", "帧数和帧率共同影响时长与运动观感。", "直接处理所有帧计算量很大。"], "video shape: [time, channels, height, width]", "视频相对图像新增的关键维度是？", ["词表维度", "时间维度", "梯度维度"], 1, "时间维度使运动和跨帧一致性成为核心问题。", "列出静态图像很好但视频仍可能失败的两个例子。")
    },
    {
      id: "video-vae", track: "video", code: "V2", title: "3D VAE", subtitle: "同时压缩空间与时间", x: 300, y: 220, deps: ["video-representation", "vae"], level: "核心", minutes: 21,
      lesson: lesson("3D VAE 同时压缩视频的空间和时间信息，生成模型在更小的时空 latent 上工作。", "逐帧独立压缩可能破坏运动连续性，视频压缩需要理解相邻帧。", ["空间压缩降低分辨率成本。", "时间压缩减少序列长度。", "解码质量影响最终细节和时间稳定性。"], "video -> spatiotemporal encoder -> latent video", "3D VAE 与图像 VAE 的主要新增挑战是？", ["处理词表", "建模和压缩时间关系", "生成 Git 提交"], 1, "视频 VAE 必须处理跨帧关系，而不只是单帧空间结构。", "说明时间压缩过强可能造成什么视觉问题。")
    },
    {
      id: "temporal-modeling", track: "video", code: "V3", title: "Temporal Modeling", subtitle: "学习运动与变化", x: 510, y: 330, deps: ["video-vae"], level: "核心", minutes: 22,
      lesson: lesson("Temporal modeling 让模型理解物体如何随时间移动、形变和交互。", "没有时间建模，视频只是相互独立的漂亮图片，容易闪烁和跳变。", ["时间 Attention 可连接不同帧。", "运动既包含局部位移，也包含长期事件变化。", "镜头运动和物体运动需要区分。"], "spatial relation + temporal relation -> motion representation", "只逐帧生成最容易出现什么问题？", ["词表太小", "跨帧不一致和闪烁", "无法使用 RGB"], 1, "单帧质量不能保证时间一致性。", "分析‘人物脸每帧都好看但身份不断变化’缺少了什么约束。")
    },
    {
      id: "video-dit", track: "video", code: "V4", title: "Video DiT", subtitle: "时空 token 的 Transformer", x: 720, y: 220, deps: ["temporal-modeling", "dit"], level: "架构", minutes: 23,
      lesson: lesson("Video DiT 把视频 latent 组织成时空 token，并用 Transformer 建模它们。", "统一时空建模有利于大规模扩展，但 token 数量和显存成本会迅速增长。", ["Patch 可以同时覆盖空间和时间。", "Attention 可采用全局或分解式时空结构。", "长视频需要更强的压缩与上下文管理。"], "video latent -> spatiotemporal patches -> Transformer", "Video DiT 的主要计算压力来自？", ["时空 token 数量巨大", "没有任何矩阵乘法", "只需要一个 token"], 0, "分辨率、帧数和时长都会增加 token 数量。", "比较全局时空 Attention 与分解式 Attention 的潜在取舍。")
    },
    {
      id: "temporal-consistency", track: "video", code: "V5", title: "Temporal Consistency", subtitle: "让世界保持连续", x: 720, y: 440, deps: ["temporal-modeling"], level: "质量", minutes: 18,
      lesson: lesson("Temporal consistency 要求身份、几何、纹理和运动在时间上保持合理连续。", "观众对突然闪烁、物体消失和身份漂移非常敏感。", ["短期一致性关注相邻帧。", "长期一致性关注跨镜头或长时间身份。", "一致性与运动幅度之间存在取舍。"], "quality = spatial fidelity + temporal coherence", "哪项属于长期一致性问题？", ["单帧轻微噪点", "主角十秒后换了一张脸", "图像宽度为 1024"], 1, "身份在较长时间跨度内漂移，是典型长期一致性失败。", "挑一个熟悉的视频生成失败案例，判断它是短期还是长期一致性问题。")
    },
    {
      id: "world-model", track: "video", code: "V6", title: "World Models", subtitle: "从视频到可预测世界", x: 930, y: 330, deps: ["video-dit", "temporal-consistency"], level: "前沿", minutes: 25,
      lesson: lesson("World model 试图学习环境状态如何随动作和时间演化，而不只是生成看起来合理的视频。", "如果模型能预测行动后果，就可能用于规划、机器人和交互式环境。", ["观察不一定等于完整环境状态。", "可控性和因果一致性比视觉真实更严格。", "视频生成能力是世界建模的一部分，但二者不完全等价。"], "state + action -> predicted next state", "世界模型相比普通视频生成更强调什么？", ["行动条件下的状态演化", "固定输出一张图", "词表排序"], 0, "世界模型关心行动会造成什么后果，目标超出视觉逼真。", "设计一个简单环境，列出状态、动作和下一状态。")
    },

    {
      id: "model-vs-agent", track: "agent", code: "A1", title: "Model vs Agent", subtitle: "预测器与任务循环", x: 70, y: 330, deps: ["output-head"], level: "基础", minutes: 16,
      lesson: lesson("模型预测 token；Agent 把模型放进观察、决策、行动、再观察的任务循环。", "能对话不等于能完成任务，真实工作需要环境反馈和连续决策。", ["模型调用是 Agent 循环中的一步。", "Agent 需要目标、状态和可执行动作。", "同一模型在不同 Agent 设计中能力表现可能不同。"], "observe -> model decides -> act -> observe -> repeat", "Agent 与基础模型最关键的区别是什么？", ["Agent 只是更大的参数文件", "Agent 包含围绕模型的任务执行循环", "Agent 不需要模型"], 1, "Agent 是系统行为模式，不只是一个模型权重文件。", "拿‘查天气并安排出行’拆成至少两轮观察与行动。")
    },
    {
      id: "tool-use", track: "agent", code: "A2", title: "Tool Use", subtitle: "从说到做", x: 285, y: 205, deps: ["model-vs-agent"], level: "核心", minutes: 19,
      lesson: lesson("工具让 Agent 能读取外部信息或改变环境，例如搜索、运行代码和编辑文件。", "模型内部知识有限且可能过时，许多任务还必须产生真实动作。", ["模型先选择工具和参数。", "Harness 执行工具并返回结构化结果。", "工具结果会进入下一轮上下文。"], "model -> tool call -> execution -> result -> model", "真正执行工具的是谁？", ["模型权重自己", "承载 Agent 的运行系统", "Tokenizer"], 1, "模型生成调用意图，外部运行系统负责校验并执行。", "为‘比较两个本地文件’设计工具名、输入和输出。")
    },
    {
      id: "state-memory", track: "agent", code: "A3", title: "State 与 Memory", subtitle: "任务如何不失忆", x: 285, y: 455, deps: ["model-vs-agent"], level: "核心", minutes: 20,
      lesson: lesson("State 保存当前任务发生了什么，Memory 选择哪些历史信息值得在未来复用。", "模型调用本身通常无状态，连续任务需要外部系统维护上下文。", ["短期状态包括计划、工具结果和未完成步骤。", "长期记忆需要检索和更新策略。", "保存一切会导致噪声、隐私和上下文膨胀。"], "task state != model parameters", "为什么不应把所有历史都塞进上下文？", ["上下文完全免费", "会增加噪声、成本和隐私风险", "模型无法读取文字"], 1, "好的记忆系统重在选择和组织，而不是无限堆积。", "为长期学习助手分别列出三项短期状态和长期记忆。")
    },
    {
      id: "harness", track: "agent", code: "A4", title: "Agent Harness", subtitle: "围绕模型的运行系统", x: 515, y: 330, deps: ["tool-use", "state-memory"], level: "系统", minutes: 24,
      lesson: lesson("Harness 是围绕模型的执行外壳：组装上下文、开放工具、保存状态、处理错误并控制循环。", "Agent 的可靠性往往来自系统设计，而不只是模型聪明程度。", ["调用层管理模型请求与响应。", "工具路由器控制可用动作及权限。", "状态、重试、预算和停止条件都属于 Harness 责任。"], "model + tools + state + loop control = agent harness", "以下哪项最像 Harness 的职责？", ["训练 tokenizer 词表", "执行工具并维护任务状态", "替模型增加参数"], 1, "Harness 负责把模型嵌入真实执行环境，并约束整个循环。", "画一个最小 Harness 数据流，至少包含模型、工具、状态和停止条件。")
    },
    {
      id: "planning", track: "agent", code: "A5", title: "Planning 与 Reflection", subtitle: "分解、检查、修正", x: 735, y: 205, deps: ["harness"], level: "策略", minutes: 19,
      lesson: lesson("Planning 把目标拆成可执行步骤，Reflection 根据结果检查并调整下一步。", "复杂任务不能只靠一次回答，需要在不确定环境中动态修正。", ["计划应服务行动，不必追求形式复杂。", "反思必须依赖可观察证据。", "过度规划会浪费 token 和时间。"], "goal -> plan -> act -> inspect -> revise", "Reflection 最有价值的依据是什么？", ["空想自己是否成功", "工具结果和验收标准", "随机改变计划"], 1, "反思要对照真实结果和完成标准，才能修正行为。", "把‘修复一个网页 Bug’写成执行、检查、修正三步循环。")
    },
    {
      id: "evaluation", track: "agent", code: "A6", title: "Evaluation Harness", subtitle: "知道系统是否真变好", x: 735, y: 455, deps: ["harness"], level: "评估", minutes: 22,
      lesson: lesson("Evaluation harness 用可重复任务、评分规则和运行记录衡量 Agent 的真实表现。", "只看少量演示很容易被漂亮输出误导，系统改动需要稳定比较。", ["任务集应覆盖正常和失败边界。", "评分可以是自动、模型评审或人工。", "必须记录成本、延迟和失败类型。"], "tasks + runner + grader + traces -> evaluation", "评估 Harness 的主要目的是什么？", ["让界面更好看", "可重复地比较 Agent 行为和质量", "替代所有用户反馈"], 1, "评估 Harness 建立可重复的测量环境，不会消除真实用户反馈的价值。", "为学习 Agent 设计三个指标：效果、成本、可靠性各一个。")
    },
    {
      id: "guardrails", track: "agent", code: "A7", title: "Guardrails", subtitle: "权限、风险与恢复", x: 945, y: 330, deps: ["planning", "evaluation"], level: "工程", minutes: 21,
      lesson: lesson("Guardrails 通过权限、验证、预算和可恢复操作控制 Agent 风险。", "Agent 能调用工具后，错误不再只是说错话，还可能真实修改外部系统。", ["高风险动作应要求确认。", "工具参数需要结构化校验。", "日志、幂等和回滚能力帮助恢复失败。"], "capability + permission + validation + recovery", "哪种操作最需要额外确认？", ["读取公开文档", "永久删除用户数据", "计算两个数字"], 1, "不可逆或高影响动作应设置更严格的授权边界。", "为文件编辑 Agent 设计三条最重要的安全边界。")
    }
  ];

  window.FOUNDATION_ATLAS = { version: 1, tracks, nodes };
})();
