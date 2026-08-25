# -*- coding: utf-8 -*-
"""
从可变字体（variable font）实例化出静态权重字体，供 OG 图生成（satori）使用。
satori 无法解析可变字体的 fvar 表，因此必须生成“真正的”静态 TTF：
不仅要固定 wght 轴，还要删除所有可变相关的表（fvar/gvar/avar/STAT 等），
否则 satori 仍会尝试解析 fvar 而报 `Cannot read properties of undefined`。
"""
import os
from fontTools import ttLib
from fontTools.varLib import instancer

# 源可变字体与输出目录
FONT_DIR = os.path.join("src", "assets", "fonts")
SRC_VF = os.path.join(FONT_DIR, "GoogleSansCode-VF.ttf")

# 需要生成的静态权重：文件名 -> wght 轴取值
TARGETS = {
    "GoogleSansCode-Regular.ttf": 400,
    "GoogleSansCode-Bold.ttf": 700,
}

# 实例化后需要清理掉的可变字体相关表（保证结果是纯静态字体）
VARIABLE_TABLES = ["fvar", "gvar", "avar", "STAT", "cvar", "MVAR", "HVAR", "VVAR"]


def read_font_all_axes(path):
    """读取可变字体的全部轴默认值，用于把所有轴一次性固定为默认，彻底静态化。"""
    font = ttLib.TTFont(path)
    axes = {}
    if "fvar" in font:
        for axis in font["fvar"].axes:
            axes[axis.axisTag] = axis.defaultValue
    font.close()
    return axes


base_axes = read_font_all_axes(SRC_VF)

for out_name, weight in TARGETS.items():
    font = ttLib.TTFont(SRC_VF)

    # 把所有轴都固定：wght 用目标值，其余轴用各自默认值，得到完全静态的实例
    pins = dict(base_axes)
    pins["wght"] = weight

    # 注意：不启用 updateFontNames，该字体的 STAT 表缺少部分 axis value，
    # 开启后会因找不到 axis value 报错；这里只需固定轴 + 删除可变表即可。
    inst = instancer.instantiateVariableFont(
        font,
        pins,
        inplace=True,
    )

    # 兜底：删除任何残留的可变相关表，确保 satori 不会去解析 fvar
    for tag in VARIABLE_TABLES:
        if tag in inst:
            del inst[tag]

    out_path = os.path.join(FONT_DIR, out_name)
    inst.save(out_path)
    size_kb = round(os.path.getsize(out_path) / 1024, 1)
    has_fvar = "fvar" in ttLib.TTFont(out_path)
    print(f"生成 {out_name} (wght={weight}) -> {size_kb} KB, fvar残留={has_fvar}")

print("完成")
