/* Read-only reference: user-supplied core v3.5 PDF, physical pages 75–76. */
(() => {
  const dialog = document.createElement('dialog');
  dialog.id = 'damageReference';
  dialog.setAttribute('aria-labelledby', 'damageReferenceTitle');
  dialog.innerHTML = `
    <header class="dr-header"><div><h2 id="damageReferenceTitle">结构与压力判定速查</h2><p>先扣数值，再查结果；多个 1 优先处理。</p></div><button type="button" class="dr-close" aria-label="关闭判定速查" autofocus>关闭 ✕</button></header>
    <div class="dr-body">
      <nav class="dr-links" aria-label="速查章节"><a href="#dr-structure">结构伤害</a><a href="#dr-heat">过热／压力</a><a href="#dr-meltdown">炉心熔解</a></nav>
      <p class="dr-note"><strong>掷骰方法：</strong>按当前已损失的结构／压力数量掷同等数量的 d6，包含本次损失，取最低值。若出现两个或更多的 1，直接使用“多个 1”一行。表中的剩余值均指<strong>扣除本次损失后</strong>的数值。</p>
      <div class="dr-columns">
        <section id="dr-structure"><h3>结构伤害</h3><p><strong>HP 降至 0：</strong>失去 1 结构 → 进行结构伤害检定 → HP 重置为满 → 承受剩余伤害。伤害足够时，会连续失去结构并再次判定。</p><p class="dr-danger"><strong>结构降至 0：机甲被摧毁。</strong></p>
          <table><caption>结构伤害表</caption><thead><tr><th scope="col">最低骰值</th><th scope="col">结果</th></tr></thead><tbody>
            <tr><th scope="row">5–6</th><td><strong>擦身而过</strong><p>受损，直到你下一回合结束。</p></td></tr>
            <tr><th scope="row">2–4</th><td><strong>系统创伤</strong><p>另掷 1d6：</p><ul><li><strong>1–3：</strong>选择一个挂载点，其上的所有武器被摧毁。</li><li><strong>4–6：</strong>选择一个系统，将其摧毁。</li></ul><p>不能选择已耗尽充能的受限武器或系统。没有有效选择时，改用另一类别；两类都没有有效选择时，改为<strong>直接命中</strong>。</p></td></tr>
            <tr><th scope="row">1</th><td><strong>直接命中</strong><ul><li><strong>剩余 3+ 结构：</strong>晕眩，直到你下一回合结束。</li><li><strong>剩余 2 结构：</strong>进行机体检定。成功：晕眩，直到你下一回合结束；失败：机甲被摧毁。</li><li><strong>剩余 1 结构：</strong>机甲被摧毁。</li></ul></td></tr>
            <tr class="dr-critical"><th scope="row">多个 1</th><td><strong>致命一击</strong><p>机甲被摧毁。驾驶员仍可正常离开。</p></td></tr>
          </tbody></table>
        </section>
        <section id="dr-heat"><h3>过热／压力</h3><p><strong>热度超过上限：</strong>失去 1 压力 → 进行过热检定 → 清除热度 → 再承受超出上限的剩余热度。剩余热度仍超限时，再次过热。<strong>刚好等于上限不触发。</strong></p><p class="dr-danger"><strong>压力降至 0：下一回合结束时炉心熔解。</strong></p>
          <table><caption>过热表</caption><thead><tr><th scope="col">最低骰值</th><th scope="col">结果</th></tr></thead><tbody>
            <tr><th scope="row">5–6</th><td><strong>紧急排热</strong><p>受损，直到你下一回合结束。</p></td></tr>
            <tr><th scope="row">2–4</th><td><strong>反应炉失衡</strong><p>进入暴露状态：在解除前，受到双倍动能、爆炸和能量伤害。不会在下一回合结束时自动解除。</p></td></tr>
            <tr><th scope="row">1</th><td><strong>炉心熔解</strong><ul><li><strong>剩余 3+ 压力：</strong>进入暴露状态。</li><li><strong>剩余 2 压力：</strong>进行工程检定。成功：进入暴露状态；失败：在你的 1d6 回合后炉心熔解，由 GM 掷骰。可用自由动作重试工程检定来阻止这次熔解。</li><li><strong>剩余 1 压力：</strong>下一回合结束时炉心熔解。</li></ul></td></tr>
            <tr class="dr-critical"><th scope="row">多个 1</th><td><strong>不可逆熔解</strong><p>下一回合结束时炉心熔解。</p></td></tr>
          </tbody></table>
        </section>
      </div>
      <section id="dr-meltdown" class="dr-note"><h3>炉心熔解时</h3><p>机甲被爆炸摧毁，仍在机甲内的驾驶员立即死亡。<strong>爆发 2</strong> 内所有角色进行<strong>敏捷豁免</strong>：失败受到 <strong>4d6 爆炸伤害</strong>，成功伤害减半。</p></section>
      <p class="dr-source">依据：《枪骑兵》核心规则书 v3.5，PDF 第 75–76 页。机体／工程<strong>检定</strong>与敏捷<strong>豁免</strong>请勿混用。特殊能力另有说明时，按其规则处理。本面板只供查询，不自动扣除角色数值。</p>
    </div>`;
  document.body.append(dialog);
  document.getElementById('openDamageReference').addEventListener('click', () => {
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('.dr-body').scrollTop = 0;
  });
  dialog.querySelector('.dr-close').addEventListener('click', () => dialog.close());
  // Keep Escape confined to this modal, preserving any panel underneath it.
  dialog.addEventListener('keydown', e => { if (e.key === 'Escape') e.stopPropagation(); });
  dialog.querySelectorAll('.dr-links a').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    dialog.querySelector(a.getAttribute('href')).scrollIntoView({block: 'start'});
  }));
})();
