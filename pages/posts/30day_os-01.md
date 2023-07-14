---
title: 30天自制操作系统 笔记 01
date: 2023-07-014
updated: 2023-07-14
categories: 30day-os
tags:
  - 笔记
---

# 前言

本系列是星雨学习 川合秀实 的《30天自制操作系统》一书的笔记

# 0x00 从计算机结构到汇编程序入门

## 计算机原理

电脑的处理中心是CPU(Central Process Unit, 中央处理单元)，CPU只能与别的电路进行
电信号交换，而且对于电信号，只能理解开(ON)和关(OFF)两种状态。

CPU无法理解电信号携带的信息，也不在乎他们，只是按照指令进行相应的处理。

能用CPU处理的不仅仅只有数据，我们还可以用电信号向CPU发出指令。

## 汇编语言编译器

作者自己开发了“NASK”

nask与nasm代码差异

|nasm|nask|
|---|---|
|JMP entry|JMP SHORT entry|
|RESB <填充字节数>|TIMES <填充字节数> DB <填充数据>|
|RESB 0x7dfe-$|TIMES 0x1fe-($-$$) DB 0
|ALIGNB 16|ALIGN 16, DB 0|

## 修改后的汇编版本系统 (helloos2)

``` asm
; hello-os
; TAB=4

; 以下是标准FAT12格式软盘专用的代码
        DB      0xeb, 0x4e, 0x90    ; BS_jmpBoot 0xEB 0x?? 0x90 INTEL指令集的无条件跳转
        DB      "HELLOIPL"          ; BS_OEMName 启动区的名称可以是任意的字符串
        DW      512
        DB      1
```