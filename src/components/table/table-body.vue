<template>
    <table cellspacing="0" cellpadding="0" border="0" :style="styleObject">
        <colgroup>
            <col v-for="(column, index) in columns" :width="setCellWidth(column, index, false)">
        </colgroup>
        <tbody :class="[prefixCls + '-tbody']">
            <template v-for="(row, index) in data">
                <table-tr
                    :row="row"
                    :key="row._rowKey"
                    :prefix-cls="prefixCls"
                    @mouseenter.native.stop="handleMouseIn(row._index)"
                    @mouseleave.native.stop="handleMouseOut(row._index)"
                    @click.native="clickCurrentRow(row._index)"
                    @dblclick.native.stop="dblclickCurrentRow(row._index)">
                    <td v-for="column in columns" :class="alignCls(column, row)">
                        <div :class="classes(column)" :title="column.ellipsis?row[column.key]:''">
                            <template v-if="renderType(column) === 'index'">{{index + 1}}</template>
                            <template v-if="renderType(column) === 'selection'">
                                <Checkbox :value="checked" @click.native.stop="handleClick" @on-change="toggleSelect" :disabled="disabled"></Checkbox>
                            </template>
                            <template v-if="renderType(column) === 'html'"><span v-html="row[column.key]"></span></template>
                            <template v-if="renderType(column) === 'normal'"><span>{{row[column.key]}}</span></template>
                            <template v-if="renderType(column) === 'expand' && !row._disableExpand">
                                <div :class="expandCls" @click="toggleExpand">
                                    <Icon type="ios-arrow-right"></Icon>
                                </div>
                            </template>
                            <Cell
                                    v-if="renderType(column) === 'render'"
                                    :row="row"
                                    :column="column"
                                    :index="row._index"
                                    :render="column.render"></Cell>
                        </div>
                    </td>
                </table-tr>
                <tr v-if="rowExpanded(row._index)">
                    <td :colspan="columns.length" :class="prefixCls + '-expanded-cell'">
                        <Expand :key="row._rowKey" :row="row" :render="expandRender" :index="row._index"></Expand>
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
</template>
<script>
    // todo :key="row"
    import TableTr from './table-tr.vue';
    import Cell from './expand';
    import Expand from './expand.js';
    import Mixin from './mixin';

    export default {
        name: 'TableBody',
        mixins: [ Mixin ],
        components: { Cell, Expand, TableTr },
        props: {
            prefixCls: String,
            styleObject: Object,
            columns: Array,
            data: Array,    // rebuildData
            objData: Object,
            columnsWidth: Object,
            fixed: {
                type: [Boolean, String],
                default: false
            }
        },
        computed: {
            expandRender () {
                let render = function () {
                    return '';
                };
                for (let i = 0; i < this.columns.length; i++) {
                    const column = this.columns[i];
                    if (column.type && column.type === 'expand') {
                        if (column.render) render = column.render;
                    }
                }
                return render;
            }
        },
        methods: {
            rowChecked (_index) {
                return this.objData[_index] && this.objData[_index]._isChecked;
            },
            rowDisabled(_index){
                return this.objData[_index] && this.objData[_index]._isDisabled;
            },
            rowExpanded(_index){
                return this.objData[_index] && this.objData[_index]._isExpanded;
            },
            handleMouseIn (_index) {
                this.$parent.handleMouseIn(_index);
            },
            handleMouseOut (_index) {
                this.$parent.handleMouseOut(_index);
            },
            clickCurrentRow (_index) {
                this.$parent.clickCurrentRow(_index);
            },
            dblclickCurrentRow (_index) {
                this.$parent.dblclickCurrentRow(_index);
            },

            toggleSelect () {
                this.$parent.$parent.toggleSelect(this.index);
            },
            toggleExpand () {
                this.$parent.$parent.toggleExpand(this.index);
            },
            handleClick () {
                // 放置 Checkbox 冒泡
            },
            classes(column){
                return [
                    `${this.prefixCls}-cell`,
                    {
                        [`${this.prefixCls}-hidden`]: !this.fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right'),
                        [`${this.prefixCls}-cell-ellipsis`]: column.ellipsis || false,
                        [`${this.prefixCls}-cell-with-expand`]: this.renderType(column) === 'expand'
                    }
                ];
            },

            renderType(column){
                var renderType = ''
                if (column.type === 'index') {
                    renderType = 'index';
                } else if (column.type === 'selection') {
                    renderType = 'selection';
                } else if (column.type === 'html') {
                    renderType = 'html';
                } else if (column.type === 'expand') {
                    renderType = 'expand';
                } else if (column.render) {
                    renderType = 'render';
                } else {
                    renderType = 'normal';
                }

                return renderType
            }
        }
    };
</script>
