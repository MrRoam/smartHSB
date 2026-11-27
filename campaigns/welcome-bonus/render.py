"""Refresh the marked sections of promotions.html from tiers.json before publishing."""

import json
from pathlib import Path


HERE = Path(__file__).resolve().parent
SITE = HERE.parents[1] / "website"
PAGE = SITE / "promotions.html"


def usd(value):
    return f"${value:,}"


def reward_card(tier):
    art = f"assets/img/bonus-tiers/{tier['art']}.webp"
    if not (SITE / art).is_file():
        raise FileNotFoundError(art)
    return f"""<li class="reward-card">
  <div class="reward-heading">
    <h3><span>达标可获赠金</span><strong>{usd(tier['reward'])}</strong></h3>
    <img src="{art}" width="320" height="320" loading="lazy" decoding="async" alt=""/>
  </div>
  <dl class="reward-terms">
    <div><dt>首次入金</dt><dd>{usd(tier['deposit'])} 起</dd></div>
    <div><dt>{tier['days']} 天内累计平仓</dt><dd>{tier['lots']} 手起</dd></div>
  </dl>
</li>"""


def reward_row(tier):
    return (f'<tr><th scope="row">{usd(tier["deposit"])}</th>'
            f'<td>{usd(tier["reward"])}</td><td>{tier["lots"]} 手</td>'
            f'<td>{tier["days"]} 天</td></tr>')


def replace_section(page, name, content):
    start = f"<!-- bonus:{name} -->"
    end = f"<!-- /bonus:{name} -->"
    if page.count(start) != 1 or page.count(end) != 1:
        raise ValueError(f"Expected one {name} section in {PAGE.name}")
    before, rest = page.split(start)
    _, after = rest.split(end)
    return f"{before}{start}\n{content}\n{end}{after}"


def render():
    tiers = sorted(json.loads((HERE / "tiers.json").read_text(encoding="utf-8")),
                   key=lambda tier: tier["deposit"])
    first, top = tiers[0], tiers[-1]
    title = f"新客入金赠金 · 达标最高可获 {usd(top['reward'])} | SmartHSB"
    description = (f"新客首次入金满 {usd(first['deposit'])} 起，在对应期限内完成指定平仓手数，"
                   f"经审核可获 {usd(first['reward'])} 至 {usd(top['reward'])} 赠金。查看各档条件与活动细则。")
    example_deposit = 80
    eligible = [tier for tier in tiers if tier["deposit"] <= example_deposit]
    example = f"例如首次入金 {usd(example_deposit)}，"
    if eligible:
        tier = eligible[-1]
        example += (f"按已达到的 {usd(tier['deposit'])} 档计算。在 {tier['days']} 天内"
                    f"累计平仓 {tier['lots']} 手，审核通过后可获 {usd(tier['reward'])}。")
    else:
        example += f"尚未达到最低入金门槛 {usd(first['deposit'])}。"
    sections = {
        "meta": f'<title>{title}</title>\n<meta name="description" content="{description}"/>\n'
                f'<meta property="og:title" content="{title}"/>\n<meta property="og:description" content="{description}"/>',
        "hero": f'<h1>新客入金赠金<span class="bonus-headline">最高可获 <strong>{usd(top["reward"])}</strong></span></h1>\n'
                f'<p class="lead">真实账户获批后，首次入金 {usd(top["deposit"])} 及以上，在 {top["days"]} 天内'
                f'累计平仓 {top["lots"]} 手，审核通过后可获最高档赠金。</p>',
        "cards": "\n".join(reward_card(t) for t in reversed(tiers) if t.get("art")),
        "rows": "\n".join(reward_row(t) for t in tiers),
        "example": f"<p>{example}</p>",
    }
    page = PAGE.read_text(encoding="utf-8")
    for name, content in sections.items():
        page = replace_section(page, name, content)
    PAGE.write_bytes(page.encode("utf-8"))


if __name__ == "__main__":
    render()
