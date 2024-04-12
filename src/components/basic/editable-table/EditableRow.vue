<template>
  <div class="table-new-row">
    <div class="table-new-row-cells">

      <template v-for="(value, key) in row">

        <template v-if="headers[key].hasOwnProperty('subHeaders')">
          <div class="table-row-multi-cell">
            <div v-for="subValue in value">{{ subValue }}</div>
          </div>
        </template>

        <template v-else>

          <editable-cell :type="headers[key].inputType" v-model="changedRow[key]"/>

        </template>

      </template>

    </div>
    <div class="table-new-row-menu">
      <div class="submit-icon" @click="submitChanges"/>
      <div class="cross-icon" @click="cancelChanges"/>
    </div>
  </div>
</template>

<script>
import EditableCell from "@/components/basic/editable-table/EditableCell";

export default {
  name: "NewRow",
  emits: ['submitChanges', 'cancelChanges'],
  components: {
    EditableCell,
  },
  props: {
    row: Object,
    headers: Object,

    textAlign: String,
    backgroundColor: String,
    additionalColor: String,
  },
  data() { return {
    changedRow: this.row,
  }},
  methods: {
    submitChanges() {
      this.$emit('submitChanges', this.changedRow)
    },
    cancelChanges() {
      this.$emit('cancelChanges')
    },
  }
}
</script>

<style scoped>
.table-new-row{
  display: flex;
  flex-direction: row;
  background-color: rgba(34, 139, 34, 0.2);
}
.table-new-row-cells{
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
.table-new-row-menu{
  display: flex;
  flex-direction: row;
  justify-content: end;
  width: 60px;
  padding: 4px;
  gap: 8px;
}
/***Icons***/
.submit-icon{
  cursor: pointer;
  background-color: white;
  height: 100%;
  aspect-ratio: 1/1;
  mask-image: url("submit.svg");
  mask-size: contain;
}
.cross-icon{
  cursor: pointer;
  background-color: white;
  height: 100%;
  aspect-ratio: 1/1;
  mask-image: url("cross.svg");
  mask-size: contain;
}
</style>