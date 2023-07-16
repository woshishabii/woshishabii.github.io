---
title: 30天自制操作系统 笔记 01
date: 2023-07-14
updated: 2023-07-14
categories: 30day-os
tags:
  - 笔记
---

## 前言

本系列是星雨学习 川合秀实 的《30天自制操作系统》一书的笔记

## 0x00 从计算机结构到汇编程序入门

### 计算机原理

电脑的处理中心是CPU(Central Process Unit, 中央处理单元)，CPU只能与别的电路进行
电信号交换，而且对于电信号，只能理解开(ON)和关(OFF)两种状态。

CPU无法理解电信号携带的信息，也不在乎他们，只是按照指令进行相应的处理。

能用CPU处理的不仅仅只有数据，我们还可以用电信号向CPU发出指令。

### 汇编语言编译器

作者自己开发了“NASK”

nask与nasm代码差异

|nasm|nask|
|---|---|
|JMP entry|JMP SHORT entry|
|RESB <填充字节数>|TIMES <填充字节数> DB <填充数据>|
|RESB 0x7dfe-$|TIMES 0x1fe-($-$$) DB 0
|ALIGNB 16|ALIGN 16, DB 0|

### 修改后的汇编版本系统 (helloos2)

注释根据微软 [FAT Specification](https://academy.cba.mit.edu/classes/networking_communications/SD/FAT.pdf) 修改

``` asm
; hello-os
; TAB=4

; 以下是标准FAT12格式软盘专用的代码
        DB      0xEB, 0x4E, 0x90    ; BS_jmpBoot        0xEB 0x?? 0x90 INTEL指令集的无条件跳转，跳转到操作系统的bootstrap代码
        DB      "HELLOIPL"          ; BS_OEMName        OEM名称标识符，可随意设置，一般用来指出这个分区由哪种系统格式化
        DW      512                 ; BPB_BytsPerSec    每扇区字节数
        DB      1                   ; BPB_SecPerClus    每个分配单元的扇区数
        DW      1                   ; BPB_RsvdSecCnt    保留区域中的保留扇区数，用于对齐数据区到簇大小的整数倍，可以为任何非0数
        DB      2                   ; BPB_NumFATs       分卷中文件分配表的数量
        DW      224                 ; BPB_RootEntCnt    对于FAT12，此字段包含根目录中32字节目录条目的数量
        DW      2880                ; BPB_TotSec16      扇区数
        DB      0xF0                ; BPB_Media         应为: 0xF0, 0xF8, 0xF9, 0xFA, 0xFB, 0xFC, 0xFD, 0xFE, 0xFF中的一个，0xF8代表不可移动设备, 可移动设备常用0xF0
        DW      9                   ; BPB_FATSz16       FAT12中，这是一个FAT占据的扇区数量
        DW      18                  ; BPB_SecPerTrk     每磁道扇区数量（中断0x13）
        DW      2                   ; BPB_NumHeads      磁头数量（中断0x13）
        DD      0                   ; BPB_HiddSec       分区前的隐藏扇区数量（中断0x13）
        DD      2880                ; BPB_TotSec32      32位的扇区数量
        DD      0xFFFFFFFF          ;                   这个东西和Spec对不上，但是4bytes貌似对应BS_VolID分卷序列号
        DB      "HELLO-OS   "       ; BS_VolLab         卷标，11位
        DB      "FAT12   "          ; BS_FilSysType     "FAT12   " "FAT16   " 或者 “FAT32   ”, 仅提供信息，不决定FAT类型
        RESB    18                  ;                   空出18字节

; 程序主体
        DB      0xB8, 0x00, 0x00, 0x8E, 0xD0, 0xBC, 0x00, 0x7C
        DB      0x8E, 0xD8, 0x8E, 0xC0, 0xBE, 0x74, 0x7C, 0x8A
        DB      0x04, 0x83, 0xC6, 0x01, 0x3C, 0x00, 0x74, 0x09
        DB      0xB4, 0x0E, 0xBB, 0x0F, 0x00, 0xCD, 0x10, 0xEB
        DB      0xEE, 0xF4, 0xEB, 0xFD

; 信息显示部分
        DB      0x0A, 0x0A          ; 换行 * 2
        DB      "hello, world"
        DB      0x0A
        DB      0

        RESB    0x1fe-$
        DB      0x55, 0xAA          ; Signature_word    设置为0x55 0xAA

; 启动区以外部分的输出

        DB      0xF0, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00
        RESB    4600
        DB      0xF0, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        RESB    1469432
```

## 0x01 汇编语言学习与Makefile入门

``` asm
; hello-os
; TAB=4

        ORG     0x7C00              ; 指明程序的装载地址

; FAT12
        JMP     entry               ; 跳转至操作系统的bootstrap代码
        DB      0x90

--- (略 FAT12分区格式) ---

; 程序核心

entry:
        MOV     AX,0                ; 
        MOV     SS,AX
        MOV     SP,0x7c00
        MOV     DS,AX
        MOV     ES,AX

        MOV     SI,msg
putloop:
        MOV     AL,[SI]
        ADD     SI,1
        CMP     AL,0

        JE      fin
        MOV     AH,0x0E
        MOV     BX,15
        INT     0x10
        JMP     putloop
fin:
        HLT
        JMP     fin
msg:
        DB      0x0A, 0x0A
        DB      "hello, world"
        DB      0x0A
        DB      0
```

一些汇编指令：

- ORG: 指明程序的开始地址，将机器语言指令装载的地址
- JMP: 跳转至制定的标签
- MOV: 赋值，MOV AX,0 相当于 AX=0;

一些寄存器：

|名称缩写|英文|中文|
|---|---|---|
|AX|Accumulator|累加寄存器|
|CX|Counter|计数寄存器|
|DX|Data|数据寄存器|
|BX|Base|基址寄存器|
|SP|Stack Pointer|栈指针寄存器|
|BP|Base Pointer|基址指针寄存器|
|SI|Source Index|源变址寄存器|
|DI|Destination Index|目的变址寄存器|

以上寄存器均为16位寄存器，虽然所有寄存器都能进行同样的计算，但是使用对应的寄存器可以使程序变得更简洁

- ADD CX,0x1234 编译后为 81 C1 34 12    (4bytes)
- ADD AX,0x1234 编译后为 05 34 12       (3bytes)

名称末尾的'X'表示‘extend(扩展)’，扩展的原8位寄存器

8位寄存器：
|名称缩写|英文|中文|
|---|---|---|
|AL|Accumulator Low|累加寄存器低位|
|CL|Counter Low|计数寄存器低位|
|DL|Data Low|数据寄存器低位|
|BL|Base Low|基址寄存器低位|
|AH|Accumulator High|累加寄存器高位|
|CH|Counter High|计数寄存器高位|
|DH|Data High|数据寄存器高位|
|BH|Base High|基址寄存器高位|

---

> MOV AI,[SI]

这里的方括号代表内存地址，我们可以用寄存器来指定内存地址，但是只有BX,BP,SI,DI这几个寄存器能用来指定
内存地址。内存对于CPU而言是外部存储器（很重要），所以CPU要通过自己的一部分管脚（引线）向内存发送电信
号来存取数据。如：

> MOV 数据大小 [678],123

指令就是要用内存的"678"号地址来保存“123”这个数值。

> 数据大小 [地址]

这是一个固定的组合，如果我们指定数据大小为"BYTE"，那么使用的存储单元就只是地址所指定的字节；如果指定
数据大小为"WORD"，那么相邻的一个字节也会成为这个指令的操作对象；如果指定的数据大小为"DWORD"，那么与
WORD相邻的两个字节也会成为这个指令的操作对象（共四字节）。（这里的相邻是地址增加方向的相邻）

```
---------123-----------
| 00000000 | 01111011 |       |       Memory       |
-----------------------       |--------------------|
      |          \----------> |      01111011      |   678   （制定地址）
      \---------------------> |      00000000      |   679   （邻居）
```

- ADD: 加法指令，ADD SI,1 --> SI=SI+1;
- CMP: 比较指令，简单的来说，是if语句的一部分

``` if(a==3) { 处理; } ```

要将a与3比较时，应先写CMP a,3，告诉CPU比较的对象，然后再写进一步的条件。JE(Jump if Equal)是条件
跳转指令之一，根据比较结果决定是否跳转。如果相等，则跳转到对应地址；如不相等，则继续执行下方的代码。
因此

> CMP AL,0
> JE fin

相当于

``` if (AL == 0) { goto fin; } ```

- INT: 软件中断指令，中断机制现暂时可看做函数调用。

来自[OSDEV Wiki](https://wiki.osdev.org/BIOS)

BIOS用于提供一些基础的低级服务给初期的系统程序，基本的目的是尽可能的避免机型之间的差别对操作系统和
软件的影响。BIOS还提供了一些函数来让开发更简单。为了调用这些函数，一般需要设置CPU AH寄存器
（或AX, EAX）至特定的值然后执行INT命令。寄存器的值和中断序号共同决定调用的函数。

|中断序号|描述|
|---|---|
|INT 0x10|视频显示相关|
|INT 0x11|硬件检测|
|INT 0x13|大容量存储的访问（硬盘、软盘）|
|INT 0x15|内存大小|
|INT 0x16|键盘|

常见函数

|中断序号|AH寄存器|描述|
|---|---|---|
|INT 0x10|1|初始光标|
||3|光标位置|
||0xE|显示字符|
||0xF|获取视频页和模式|
||0x11|设置8*8字体|
||0x12|检测 EGA/VGA|
||0x13|显示字符串|
||0x1200|备用屏幕输出(Alternate Print Screen)|
||0x1201|关闭光标模拟|
||0x4F00|视频内存大小|
||0x4F01|VESA获取模式信息调用|
||0x4F02|选择VESA视频模式|
||0x4F0A|VESA2.0保护模式接口|
|0x13|0|重置软盘/硬盘|
||2|在CHS模式读取软盘/硬盘|
||||
||||

更多中断请看[Interrupt Jump Table](http://www.ctyme.com/intr/int.htm)