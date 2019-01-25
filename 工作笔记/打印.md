

```css
@media print {

    /* 打印忽略的内容 */
    .not-print {
        display: none!important;
    }
    /* 内容块中内容强制不换行 */
    .no-break {
        page-break-inside: avoid;
    }

   /* 强制分页组合 */

   /* 后面内容强制分页打印 */
    .print-end {
        display: block;
        page-break-after:always;
        break-after:always;
    }
    /* 前面内容强制分页打印 */
    .print-start {
        display: block;
        page-break-before:always;
        break-before:always;
    }
    /* 页面相关设置 */
    @page {  
        size: A4 landscape;
        margin: 0; // 去除页眉页脚
        
    }
}

```