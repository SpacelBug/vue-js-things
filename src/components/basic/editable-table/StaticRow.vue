<template>
  <div class="table-row">
    <div class="table-row-cells" @click="$emit('rowClick')">
      <template v-for="(value, key) in row">

        <template v-if="headers[key].hasOwnProperty('subHeaders')">
          <div class="table-row-multi-cell">
            <div v-for="subValue in value">{{ subValue }}</div>
          </div>
        </template>

        <template v-else>
          <div class="table-row-cell">
            {{ value }}
          </div>
        </template>

      </template>
    </div>
    <div class="table-row-menu">
      <div
          class="row-settings-button"
          tabindex="0"
          @focusin="isShowContextRowMenu = true"
          @focusout="isShowContextRowMenu = false"
      >
        <div class="settings-icon"/>
        <div
            v-show="isShowContextRowMenu"
            class="context-row-menu"
        >
          <div class="context-row-menu-button" @click="isShowContextRowMenu = false; $emit('changeRowClick')">Изменить</div>
          <div class="context-row-menu-button" @click="isShowContextRowMenu = false; copyRow">Скопировать</div>
          <div class="context-row-menu-button" @click="isShowContextRowMenu = false; $emit('deleteRowClick')">Удалить</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "TableRow",
  emits: ['rowClick', 'deleteRowClick', 'changeRowClick'],
  props: {
    row: Object,
    headers: Object,

    textAlign: String,
    backgroundColor: String,
    additionalColor: String,
  },
  data() { return {
    isShowContextRowMenu: false
  }},
  methods: {
    copyRow() {
      navigator.clipboard.writeText(JSON.stringify(this.row))
    }
  }
}
</script>

<style scoped>
.table-row{
  display: flex;
  flex-direction: row;
}
.table-row-cells{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
}
.table-row-cell{
  width: 100%;
  text-align: v-bind(textAlign);
  height: fit-content;
  padding: 4px 0;
}
.table-row-multi-cell{
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  height: fit-content;
  padding: 4px 0;
}
.table-row-multi-cell div{
  width: 100%;
  text-align: v-bind(textAlign);
}
.table-row-menu{
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: end;
  width: 60px;
  padding: 4px;
}
.context-row-menu{
  position: absolute;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  right: 0;
  background-color: v-bind(additionalColor);
}
.context-row-menu-button{
  user-select: none;
  cursor: pointer;
}
.row-settings-button{
  height: 100%;
  aspect-ratio: 1/1;
  width: fit-content;
}
/***Icons***/
.settings-icon{
  cursor: pointer;
  background-color: white;
  height: 100%;
  aspect-ratio: 1/1;
  mask-image: url("settings.svg");
  mask-size: contain;
}
</style>