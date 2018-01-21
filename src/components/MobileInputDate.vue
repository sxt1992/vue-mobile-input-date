<template>
  <div v-show="showInput" class="mobile-input-date">
    <div class="mobile-input-date-opr">
      <div class="mobile-input-date-opr-btn">
        <span @click="cancel">取消</span>
        <span>{{selectShow}}</span>
        <span v-if="canSave" @click="confirm">完成</span>
      </div>
      <div class="mobile-input-date-opr-show">
        <span :class="{active: dateShowIndex == 0}" @click="dateShowClick(0)" v-show="isRangeDate">
          <h3>开始日期</h3>
          <p>{{dateShow.d0}}</p>
        </span>
        <em v-show="isRangeDate">--</em>
        <span :class="{active: dateShowIndex == 1}" @click="dateShowClick(1)" v-show="isRangeDate">
          <h3>结束日期</h3>
          <p>{{dateShow.d1}}</p>
        </span>
        <span :class="{active: dateShowIndex == 2}" @click="dateShowClick(2)" class="single-show" v-show="!isRangeDate">
          <h3>选定日期</h3>
          <p>{{dateShow.d2}}</p>
        </span>
      </div>
    </div>
    <div class="mobile-input-date-main">
      <div class="date-head">
        <span class="date-head-double-left" @click="titleShowYearChange(-1)"><img src="./images/double_arrow.png"><img src="./images/double_arrow_blue.png"></span>
        <span class="date-head-left" @click="titleShowMonthChange(-1)" :style="{visibility: pickerCellShow==2 ? 'visible' : 'hidden'}"><img src="./images/arrow.png"><img src="./images/arrow_blue.png"></span>
        <div class="date-head-title">
          <span class="date-head-year" v-show="pickerCellShow==2" @click="clickTitleYear">{{titleShow.year}}年</span>
          <span class="date-head-month" v-show="pickerCellShow==2" @click="clickTitleMonth">{{titleShow.month}}月</span>
          <em v-show="pickerCellShow!=2" @click="clickTitleYear">{{titleShow.yearOrRange}}</em>
        </div>
        <span class="date-head-right" @click="titleShowMonthChange(1)" :style="{visibility: pickerCellShow==2 ? 'visible' : 'hidden'}"><img src="./images/arrow.png"><img src="./images/arrow_blue.png"></span>
        <span class="date-head-double-right" @click="titleShowYearChange(1)"><img src="./images/double_arrow.png"><img src="./images/double_arrow_blue.png"></span>
      </div>
      <div class="date-body">
        <div class="picker-year-cell" v-show="pickerCellShow==0">
          <span v-for="index in 10" :key="'year'+index" @click="clickTitleMonth(index-1)">{{index + tenYearStart - 1}}</span>
        </div>
        <div class="picker-month-cell" v-show="pickerCellShow==1">
          <span v-for="item in 12" :key="'month'+item" @click="selectMonth(item)">{{item}}月</span>
        </div>
        <div class="picker-day-cell" v-show="pickerCellShow==2"><span v-for="item in ['日', '一', '二', '三', '四', '五', '六']" :key="'titleM'+item" class="picker-cell-cor-gray">{{item}}</span><span v-for="item in dateMain.prevMonth" :key="item.key" class="picker-cell-cor-gray">{{item.val}}</span><span v-for="item in dateMain.currMonth" :key="item.key"
          :class="{active: dayIsSelect(item.val)}" @click="selectDay(item.val)">{{item.val}}</span><span v-for="item in dateMain.nextMonth" :key="item.key" class="picker-cell-cor-gray">{{item.val}}</span></div>
      </div>
    </div>
  </div>
</template>

<script>

const dateFormat = {
  toDate(d) {
    const t = new Date(d);
    if (t.getDate()) {
      return t;
    } else if (typeof d !== 'string') {
      return new Date();
    }
    const arrD = /^\D*(\d+)\D+(\d+)\D+(\d+)/.exec(d);
    if (!arrD) {
      return new Date();
    }
    return new Date(arrD[1], arrD[2] - 1, arrD[3]);
  },
  toStr(dt) {
    const t = this.toDate(dt);
    const y = `${t.getFullYear()}`;
    let m = t.getMonth();
    let d = t.getDate();
    m = `${m < 9 ? '0' : ''}${m + 1}`;
    d = `${d < 10 ? '0' : ''}${d}`;
    return {
      str: `${y}-${m}-${d}`,
      y,
      m,
      d
    };
  }
};

export default {
  name: 'mobileInputDate',
  data() {
    return {
      showInput: false, // 当前窗口是否显示
      selectShow: '', // 选择了多少天
      activeDate: {
        y: '',
        m: '',
        d: ''
      },
      dateMain: {
        prevMonth: [],
        currMonth: [],
        nextMonth: []
      },
      pickerCellShow: 2,
      dateShowIndex: 0, // 日期显示,活动窗口。0 开始,1 结束,2 单选日期
      // 日期显示
      dateShow: {
        d0: '',
        d1: '',
        d2: ''
      },
      // 标题显示
      titleShow: {
        year: '',
        month: '',
        yearOrRange: ''
      },
      // 十年一个范围
      tenYearStart: dateFormat.toStr().y - dateFormat.toStr().y % 10
    };
  },
  props: {
    type: {
      required: true,
      type: String,
      default: 'daterange'
    },
    value: {
      type: Object,
      default() {
        return {
          startDate: '',
          endDate: '',
          d: ''
        };
      }
    }
  },
  watch: {
    value() {
      this.initValue();
    },
    ['value.visible']() {
      this.initValue();
    },
    ['titleShow.year']() {
      this.setPanel(`${this.titleShow.year}-${this.titleShow.month}-15`);
    },
    ['titleShow.month']() {
      this.setPanel(`${this.titleShow.year}-${this.titleShow.month}-15`);
    },
    ['dateShow.d0']() {
      this.howLongIsSelect();
    },
    ['dateShow.d1']() {
      this.howLongIsSelect();
    }
  },
  created() {
    this.initValue();
    this.setPanel(this.isRangeDate ? this.dateShow.d0 : this.dateShow.d2);
    this.dateShowIndex = this.isRangeDate ? 0 : 2;
  },
  computed: {
    // 是否为日期范围
    isRangeDate() {
      if (this.type.trim() === 'daterange') {
        return true;
      } else {
        return false;
      }
    },
    canSave() {
      if (this.isRangeDate && (!this.dateShow.d0.trim() || !this.dateShow.d1.trim())) {
        return false;
      } else if (!this.isRangeDate && !this.dateShow.d2.trim()) {
        return false;
      }
      return true;
    }
  },
  methods: {
    initValue() {
      if (this.value.visible) {
        this.showInput = true;
      } else {
        this.showInput = false;
      }

      if (this.isRangeDate) {
        if (this.value.startDate) {
          const t = dateFormat.toStr(this.value.startDate);
          this.dateShow.d0 = t.str;
          this.activeDate = {
            y: +t.y,
            m: +t.m,
            d: +t.d
          };
        }
        if (this.value.endDate) {
          this.dateShow.d1 = dateFormat.toStr(this.value.endDate).str;
        }
        this.howLongIsSelect();
      } else {
        if (this.value.oneDate) {
          const t = dateFormat.toStr(this.value.oneDate);
          this.dateShow.d2 = t.str;
          this.activeDate = {
            y: +t.y,
            m: +t.m,
            d: +t.d
          };
        }
      }
    },
    howLongIsSelect() {
      if (!this.isRangeDate) {
        return;
      }
      if (!this.dateShow.d0.trim() || !this.dateShow.d1.trim()) {
        this.selectShow = '已选择0天';
      } else {
        // 秒数
        const long = Math.abs(dateFormat.toDate(this.dateShow.d1).getTime() - dateFormat.toDate(this.dateShow.d0).getTime()) / 1000;
        this.selectShow = `已选择${Math.round(long / (24 * 60 * 60)) + 1}天`;
      }
    },
    setPanel(d) {
      const s = dateFormat.toStr(d);
      // d月份1号
      const t = new Date(s.y, s.m - 1);
      let i = t.getDay();
      // 上月最后一天多少号
      let prevMonthEnd = new Date(t.getTime() - 1).getDate();
      // 当月最后一天多少号
      const currMonthEnd = new Date(new Date(s.y, s.m).getTime() - 1).getDate();

      // 计算上月多少天
      let monthDayArr = [];
      while (i) {
        monthDayArr.unshift({
          key: `prevMonth${prevMonthEnd}`,
          val: prevMonthEnd
        });
        prevMonthEnd--;
        i--;
      }
      this.dateMain.prevMonth = monthDayArr;
      // 计算当月多少天
      monthDayArr = [];
      while (i < currMonthEnd) {
        monthDayArr.push({
          key: `currMonth${i + 1}`,
          val: i + 1
        });
        i++;
      }
      this.dateMain.currMonth = monthDayArr;
      // 计算下月多少天
      monthDayArr = [];
      for (i = 42 - this.dateMain.prevMonth.length - this.dateMain.currMonth.length; i > 0; i--) {
        monthDayArr.unshift({
          key: `nextMonth${i}`,
          val: i
        });
      }
      this.dateMain.nextMonth = monthDayArr;

      // 显示标题
      this.titleShow.year = +s.y;
      this.titleShow.month = +s.m;
    },
    // 日期.天是否选中
    dayIsSelect(day) {
      return this.activeDate.y === +this.titleShow.year &&
              this.activeDate.m === +this.titleShow.month &&
              this.activeDate.d === +day;
    },
    // 选择某一天
    selectDay(day) {
      if (this.dayIsSelect(day)) {
        return;
      }
      this.activeDate.y = this.titleShow.year;
      this.activeDate.m = this.titleShow.month;
      this.activeDate.d = day;

      this.dateShow[`d${this.dateShowIndex}`] = dateFormat.toStr(`${this.activeDate.y}-${this.activeDate.m}-${this.activeDate.d}`).str;
    },
    // 活动窗口被点击
    dateShowClick(index) {
      this.dateShowIndex = index;
      const dateShowD = this.dateShow[`d${index}`];
      const d = dateFormat.toStr(dateShowD);
      this.titleShow.year = +d.y;
      this.titleShow.month = +d.m;
      if (dateShowD.trim()) {
        this.activeDate.y = this.titleShow.year;
        this.activeDate.m = this.titleShow.month;
        this.activeDate.d = +d.d;
      } else {
        this.activeDate.d = '';
      }
    },
    // 点击头部的年份
    clickTitleYear() {
      this.pickerCellShow = 0;
      this.tenYearStart = this.titleShow.year - this.titleShow.year % 10;
      this.titleShow.yearOrRange = `${this.tenYearStart}年-${this.tenYearStart + 9}年`;
    },
    // 点击头部的月份
    clickTitleMonth(index) {
      this.pickerCellShow = 1;
      if (typeof index === 'number') {
        this.titleShow.year = this.tenYearStart + index;
      }
      this.titleShow.yearOrRange = `${this.titleShow.year}年`;
    },
    // 选择月份
    selectMonth(m) {
      this.pickerCellShow = 2;
      this.titleShow.month = m;
    },
    // 点击左右双箭头,加减年份
    titleShowYearChange(aOrm) {
      if (this.pickerCellShow === 0) {
        this.tenYearStart += aOrm * 10;
        this.titleShow.yearOrRange = `${this.tenYearStart}年-${this.tenYearStart + 9}年`;
        return;
      }
      this.titleShow.year += aOrm;
      this.titleShow.yearOrRange = `${this.titleShow.year}年`;
    },
    // 点击左右箭头,加减月份
    titleShowMonthChange(aOrm) {
      const t = new Date(this.titleShow.year, this.titleShow.month - 1 + aOrm);
      this.titleShow.year = t.getFullYear();
      this.titleShow.month = t.getMonth() + 1;
    },
    // 取消
    cancel() {
      this.showInput = false;
    },
    // 完成
    confirm() {
      const v = this.value;
      v.visible = false;

      if (this.isRangeDate) {
        v.startDate = this.dateShow.d0;
        v.endDate = this.dateShow.d1;
        this.$emit('input', v);
      } else {
        v.oneDate = this.dateShow.d2;
        this.$emit('input', v);
      }
    }
  }
};
</script>

<style lang="less">

.mobile-input-date {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 0.42rem;

  * {
    box-sizing:border-box;
  }
  .mobile-input-date-opr {
    .mobile-input-date-opr-btn {
      height: 1.2rem;
      background: #f7f7f7;

      span {
        float: left;
        width: 20%;
        height: 100%;
        color: #39f;
        font-weight: bold;
        font-size: 0.46rem;
        line-height: 1.2rem;
        text-align: center;

        &:nth-of-type(2) {
          width: 60%;
          color: #000;
          font-size: 0.5rem;
          overflow: hidden;
        }
        &:active {
          opacity: 0.6;
          &:nth-of-type(2) {
            opacity: 1;
          }
        }
      }
    }
    .mobile-input-date-opr-show {
      height: 2rem;
      border-bottom: 1px solid #e3e8ee;

      span {
        float: left;
        width: 45%;
        height: 100%;
        padding-top: 0.26rem;
        text-align: center;

        h3 {
          height: 0.7rem;
          margin: 0;
          color: #b9b9b9;
          font-weight: bold;
          font-size: 0.48rem;
          line-height: 0.7rem;
        }
        p {
          height: 0.7rem;
          margin: 0;
          font-weight: bold;
          font-size: 0.52rem;
          line-height: 0.7rem;
        }
        &.single-show {
          width: 100%;
        }

        &.active {
          border: 1px solid rgba(132, 215, 239, 0.8);
        }
      }
      em {
        float: left;
        width: 10%;
        height: 100%;
        font-style: normal;
        font-weight: bolder;
        line-height: 2rem;
        text-align: center;
      }
    }
  }

  .mobile-input-date-main {
    width: 10rem;
    margin-top: 10px;
    border: 1px solid #e3e8ee;

    .date-head {
      height: 1.48rem;
      padding: 0.12rem 0.4629rem 0;
      font-size: 0;
      border-bottom: 1px solid #e3e8ee;

      span {
        display: inline-block;
        width: 1.2rem;
        height: 1.2rem;
        line-height: 1.2rem;
        text-align: center;
        vertical-align: top;

        img {
          display: none;
          width: 0.56rem;
          height: 0.56rem;
          margin: 0.3rem 0 0;
          padding: 0;
          border: none;

          &:nth-of-type(1) {
            display: inline-block;
          }
        }
        &:active {
          img {
            display: inline-block;
            margin-left: 2px;

            &:nth-of-type(1) {
              display: none;
            }
          }
        }

        &.date-head-double-left {
          img {
            transform: scale(-1, 1);
          }
        }
        &.date-head-left {
          margin-left: 0.2rem;
          img {
            transform: scale(-1, 1);
          }
        }
        &.date-head-right {
          margin-right: 0.2rem;
        }
        &.date-head-double-right {
        }
      }
      .date-head-title {
        display: inline-block;
        width: 3.78rem;
        font-size: 0.42rem;
        text-align: center;

        .date-head-year {
          width: 1.6rem;
        }
        .date-head-month {
          width: 1rem;
        }
        em {
          height: 1.2rem;
          font-style: normal;
          line-height: 1.2rem;
        }
      }
    }
    .date-body {
      height: 9.1rem;
      padding-left: 0.4629rem;

      &>* {
        height: 100%;
        span {
          display: inline-block;
          text-align: center;
          border-radius: 4px;

          &:hover, &.active {
            color: #fff;
            background: #39f;
          }
        }
      }

      .picker-year-cell, .picker-month-cell {
        span {
          width: 1.84rem;
          height: 1.3rem;
          margin: 0.46rem 0.56rem;
          line-height: 1.3rem;
        }
      }
      .picker-day-cell {
        span {
          width: 1.1rem;
          height: 1.1rem;
          margin: 0.1rem;
          line-height: 1.1rem;

          &.picker-cell-cor-gray {
            color: #c3cbd6;
          }
        }
      }
    }
  }
}
</style>
