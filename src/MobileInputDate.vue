<template>
    <div v-show="visible" class="mobile-input-date">
        <div class="mobile-input-date-opr">
            <div class="mobile-input-date-opr-btn">
                <span @click="cancel">取消</span>
                <span>{{selectShow}}</span>
                <span v-if="canSave" @click="confirm">完成</span>
            </div>
            <div class="mobile-input-date-opr-show">
                <span :class="{active: dateShowIndex == 0}" @click="dateShowClick(0)" v-show="isRange">
                    <h3>开始日期</h3>
                    <p>{{dateShow.d0}}</p>
                </span>
                <em v-show="isRange">--</em>
                <span :class="{active: dateShowIndex == 1}" @click="dateShowClick(1)" v-show="isRange">
                    <h3>结束日期</h3>
                    <p>{{dateShow.d1}}</p>
                </span>
                <span :class="{active: dateShowIndex == 2}" @click="dateShowClick(2)" class="single-show" v-show="!isRange">
                    <h3>选定日期</h3>
                    <p>{{dateShow.d2}}</p>
                </span>
            </div>
        </div>
        <div class="mobile-input-date-main">
            <div class="date-head">
                <span class="date-head-double-left" @click="titleShowYearChange(-1)" :class="{hidden: limitDate.dleft}"><img src="./images/double_arrow.png"><img src="./images/double_arrow_blue.png"></span>
                <span class="date-head-left" @click="titleShowMonthChange(-1)" :class="{hidden: pickerCellShow!=2 || limitDate.left}"><img src="./images/arrow.png"><img src="./images/arrow_blue.png"></span>
                <div class="date-head-title">
                    <span class="date-head-year" v-show="pickerCellShow==2" @click="clickTitleYear">{{titleShow.year}}年</span>
                    <span class="date-head-month" v-show="pickerCellShow==2" @click="clickTitleMonth">{{titleShow.month}}月</span>
                    <em v-show="pickerCellShow!=2" @click="clickTitleYear">{{titleShow.yearOrRange}}</em>
                </div>
                <span class="date-head-right" @click="titleShowMonthChange(1)" :class="{hidden: pickerCellShow!=2 || limitDate.right}"><img src="./images/arrow.png"><img src="./images/arrow_blue.png"></span>
                <span class="date-head-double-right" @click="titleShowYearChange(1)" :class="{hidden: limitDate.dright}"><img src="./images/double_arrow.png"><img src="./images/double_arrow_blue.png"></span>
            </div>
            <div class="date-body">
                <div class="picker-year-cell" v-show="pickerCellShow==0">
                    <span v-for="index in 10" :key="'year'+index" @click="clickTitleMonth(index-1)"
                        :class="{hidden: limitDate.startYear > index + tenYearStart - 1 ||
                                            limitDate.endYear < index + tenYearStart - 1}">{{index + tenYearStart - 1}}</span>
                </div>
                <div class="picker-month-cell" v-show="pickerCellShow==1">
                    <span v-for="item in 12" :key="'month'+item" @click="selectMonth(item)"
                        :class="{hidden: limitDate.startMonth > item || limitDate.endMonth < item}">{{item}}月</span>
                </div>
                <div class="picker-day-cell" v-show="pickerCellShow==2"><span v-for="item in ['日', '一', '二', '三', '四', '五', '六']" :key="'titleM'+item" class="picker-cell-cor-gray">{{item}}</span><span v-for="item in dateMain.prevMonth" :key="item.key" class="picker-cell-cor-gray">{{item.val}}</span><span v-for="item in dateMain.currMonth" :key="item.key"
                :class="{
                    active: dayIsSelect(item.val),
                    'picker-cell-cor-gray': item.val < limitDate.startDate || item.val > limitDate.endDate
                }" @click="selectDay(item.val)">{{item.val}}</span><span v-for="item in dateMain.nextMonth" :key="item.key" class="picker-cell-cor-gray">{{item.val}}</span></div>
            </div>
        </div>
    </div>
</template>

<script>
// 生成 style 样式
// eslint-disable-next-line
genStyle();

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
            y: +y,
            m: +m,
            d: +d
        };
    }
};

export default {
    name: 'mobileInputDate',
    data() {
        return {
            isComponent: true, // 是否为组件
            visible: null, // 当前窗口是否显示
            isRange: true, // 是否为日期范围
            startDate: dateFormat.toStr(new Date()).str,
            endDate: dateFormat.toStr(new Date()).str,
            oneDate: dateFormat.toStr(new Date()).str,
            limit: {
                start: '1900-01-01',
                end: '2099-12-31'
            },
            resolve: null, // promise
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
            // eslint-disable-next-line
            tenYearStart: dateFormat.toStr().y - dateFormat.toStr().y % 10
        };
    },
    props: {
        value: {
            type: Object,
            default() {
                return {
                    visible: false,
                    isRange: false,
                    startDate: dateFormat.toStr(new Date()).str,
                    endDate: dateFormat.toStr(new Date()).str,
                    oneDate: dateFormat.toStr(new Date()).str,
                    limit: {
                        start: '',
                        end: ''
                    }
                };
            }
        }
    },
    watch: {
        value() {
            this.initValue();
        },
        'value.visible'() {
            this.initValue();
        },
        'titleShow.year'() {
            this.setPanel(`${this.titleShow.year}-${this.titleShow.month}-15`);
        },
        'titleShow.month'() {
            this.setPanel(`${this.titleShow.year}-${this.titleShow.month}-15`);
        },
        'dateShow.d0'() {
            this.howLongIsSelect();
        },
        'dateShow.d1'() {
            this.howLongIsSelect();
        }
    },
    created() {
        this.initValue();
    },
    computed: {
        canSave() {
            if (this.isRange && (!this.dateShow.d0.trim() || !this.dateShow.d1.trim())) {
                return false;
            } else if (!this.isRange && !this.dateShow.d2.trim()) {
                return false;
            }
            return true;
        },
        limitDate() {
            const start = dateFormat.toStr(this.limit.start);
            const end = dateFormat.toStr(this.limit.end);

            const limit = {
                left: false,
                dleft: false,
                right: false,
                dright: false,
                startYear: 1900,
                endYear: 2099,
                startMonth: 1,
                endMonth: 12,
                startDate: 1,
                endDate: 31
            };

            if (this.pickerCellShow === 0) {
                if (this.tenYearStart < start.y) {
                    limit.dleft = true;
                    limit.startYear = start.y;
                }
                if (this.tenYearStart + 10 > end.y) {
                    limit.dright = true;
                    limit.endYear = end.y;
                }
            }

            if (this.pickerCellShow === 1) {
                if (this.titleShow.year === start.y) {
                    limit.dleft = true;
                    limit.startMonth = start.m;
                }
                if (this.titleShow.year === end.y) {
                    limit.dright = true;
                    limit.endMonth = end.m;
                }
            }

            if (this.pickerCellShow === 2) {
                if (this.titleShow.year === start.y) {
                    limit.dleft = true;
                    if (this.titleShow.month === start.m) {
                        limit.left = true;
                        limit.startDate = start.d;
                    }
                }
                if (this.titleShow.year === end.y) {
                    limit.dright = true;
                    if (this.titleShow.month === end.m) {
                        limit.right = true;
                        limit.endDate = end.d;
                    }
                }
            }
            return limit;
        }
    },
    methods: {
        initValue() {
            if (this.isComponent) {
                this.visible = this.value.visible;
                this.isRange = this.value.isRange;
                this.startDate = this.value.startDate;
                this.endDate = this.value.endDate;
                this.oneDate = this.value.oneDate;
                if (this.value.limit) {
                    this.value.limit.start && (this.limit.start = this.value.limit.start);
                    this.value.limit.end && (this.limit.end = this.value.limit.end);
                }
            }

            if (this.isRange) {
                if (this.startDate) {
                    const t = dateFormat.toStr(this.startDate);
                    this.dateShow.d0 = t.str;
                    this.activeDate = {
                        y: t.y,
                        m: t.m,
                        d: t.d
                    };
                }
                if (this.endDate) {
                    this.dateShow.d1 = dateFormat.toStr(this.endDate).str;
                }
            } else if (this.oneDate) {
                const t = dateFormat.toStr(this.oneDate);
                this.dateShow.d2 = t.str;
                this.activeDate = {
                    y: t.y,
                    m: t.m,
                    d: t.d
                };
            }
            this.setPanel(this.isRange ? this.dateShow.d0 : this.dateShow.d2);
            this.dateShowIndex = this.isRange ? 0 : 2;
            this.howLongIsSelect();
        },
        howLongIsSelect() {
            if (!this.isRange) {
                this.selectShow = '';
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
            // 显示标题
            this.titleShow.year = s.y;
            this.titleShow.month = s.m;

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
                prevMonthEnd -= 1;
                i -= 1;
            }
            this.dateMain.prevMonth = monthDayArr;
            // 计算当月多少天
            monthDayArr = [];
            while (i < currMonthEnd) {
                monthDayArr.push({
                    key: `currMonth${i + 1}`,
                    val: i + 1
                });
                i += 1;
            }
            this.dateMain.currMonth = monthDayArr;
            // 计算下月多少天
            monthDayArr = [];
            // eslint-disable-next-line
            for (i = 42 - this.dateMain.prevMonth.length - this.dateMain.currMonth.length; i > 0; i--) {
                monthDayArr.unshift({
                    key: `nextMonth${i}`,
                    val: i
                });
            }
            this.dateMain.nextMonth = monthDayArr;
        },
        // 日期.天是否选中
        dayIsSelect(day) {
            return this.activeDate.y === +this.titleShow.year &&
                  this.activeDate.m === +this.titleShow.month &&
                  this.activeDate.d === +day;
        },
        // 选择某一天
        selectDay(day) {
            // 小于开始日期 和 大于结束日期
            if (day < this.limitDate.startDate || day > this.limitDate.endDate) {
                return;
            }
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
            this.titleShow.year = d.y;
            this.titleShow.month = d.m;
            if (dateShowD.trim()) {
                this.activeDate.y = this.titleShow.year;
                this.activeDate.m = this.titleShow.month;
                this.activeDate.d = d.d;
            } else {
                this.activeDate.d = '';
            }
        },
        // 点击头部的年份
        clickTitleYear() {
            this.pickerCellShow = 0;
            // eslint-disable-next-line
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
            // eslint-disable-next-line
            const t = new Date(this.titleShow.year, this.titleShow.month - 1 + aOrm);
            this.titleShow.year = t.getFullYear();
            this.titleShow.month = t.getMonth() + 1;
        },
        // 取消
        cancel() {
            this.visible = false;
            this.pickerCellShow = 2;

            if (this.isComponent) {
                this.$emit('input', {
                    visible: this.visible,
                    isRange: this.isRange,
                    startDate: this.dateShow.d0,
                    endDate: this.dateShow.d1,
                    oneDate: this.dateShow.d2,
                    limit: {
                        start: this.limit.start,
                        end: this.limit.end
                    }
                });
            }
        },
        // 完成
        confirm() {
            this.cancel();
            if (!this.isComponent) {
                const resolve = this.resolve;
                if (resolve) {
                    this.resolve = null;
                } else {
                    return;
                }

                if (this.isRange) {
                    resolve({
                        startDate: this.dateShow.d0,
                        endDate: this.dateShow.d1
                    });
                } else {
                    resolve({
                        oneDate: this.dateShow.d2
                    });
                }
            }
        }
    }
};

function genStyle() {
    const rem = document.documentElement.offsetWidth / 10;
    const processPix = num => `${Math.round(num * rem)}px`;
    const styleStr = `.mobile-input-date {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: ${processPix(0.42)};
  background: #fff;
}
.mobile-input-date * {
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}
.mobile-input-date .hidden {
  visibility: hidden;
}
.mobile-input-date .mobile-input-date-opr .mobile-input-date-opr-btn {
  height: ${processPix(1.2)};
  background: #f7f7f7;
}
.mobile-input-date .mobile-input-date-opr .mobile-input-date-opr-btn span {
  float: left;
  width: 20%;
  height: 100%;
  color: #39f;
  font-weight: bold;
  font-size: ${processPix(0.46)};
  line-height: ${processPix(1.2)};
  text-align: center;
}
.mobile-input-date .mobile-input-date-opr .mobile-input-date-opr-btn span:nth-of-type(2) {
  width: 60%;
  color: #000;
  font-size: ${processPix(0.5)};
  overflow: hidden;
}
.mobile-input-date .mobile-input-date-opr .mobile-input-date-opr-btn span:active {
  opacity: 0.6;
}
.mobile-input-date .mobile-input-date-opr .mobile-input-date-opr-btn span:active:nth-of-type(2) {
  opacity: 1;
}
.mobile-input-date .mobile-input-date-opr .mobile-input-date-opr-show {
  height: ${processPix(2)};
  border-bottom: 1px solid #e3e8ee;
  background: #fff;
}
.mobile-input-date .mobile-input-date-opr .mobile-input-date-opr-show span {
  float: left;
  width: 45%;
  height: 100%;
  padding-top: ${processPix(0.26)};
  text-align: center;
  border: 1px solid transparent;
}
.mobile-input-date .mobile-input-date-opr .mobile-input-date-opr-show span h3 {
  height: ${processPix(0.7)};
  margin: 0;
  color: #b9b9b9;
  font-weight: bold;
  font-size: ${processPix(0.48)};
  line-height: ${processPix(0.7)};
}
.mobile-input-date .mobile-input-date-opr .mobile-input-date-opr-show span p {
  height: ${processPix(0.7)};
  margin: 0;
  font-weight: bold;
  font-size: ${processPix(0.52)};
  line-height: ${processPix(0.7)};
}
.mobile-input-date .mobile-input-date-opr .mobile-input-date-opr-show span.single-show {
  width: 100%;
}
.mobile-input-date .mobile-input-date-opr .mobile-input-date-opr-show span.active {
  border-color: rgba(132, 215, 239, 0.8);
}
.mobile-input-date .mobile-input-date-opr .mobile-input-date-opr-show em {
  float: left;
  width: 10%;
  height: 100%;
  font-style: normal;
  font-weight: bolder;
  line-height: ${processPix(2)};
  text-align: center;
}
.mobile-input-date .mobile-input-date-main {
  width: ${processPix(10)};
  margin-top: 10px;
  border: 1px solid #e3e8ee;
}
.mobile-input-date .mobile-input-date-main .date-head {
  height: ${processPix(1.48)};
  padding: ${processPix(0.12)} ${processPix(0.4629)} 0;
  font-size: 0;
  border-bottom: 1px solid #e3e8ee;
}
.mobile-input-date .mobile-input-date-main .date-head span {
  display: inline-block;
  width: ${processPix(1.2)};
  height: ${processPix(1.2)};
  line-height: ${processPix(1.2)};
  text-align: center;
  vertical-align: top;
}
.mobile-input-date .mobile-input-date-main .date-head span img {
  display: none;
  width: ${processPix(0.56)};
  height: ${processPix(0.56)};
  margin: ${processPix(0.3)} 0 0;
  padding: 0;
  border: none;
}
.mobile-input-date .mobile-input-date-main .date-head span img:nth-of-type(1) {
  display: inline-block;
}
.mobile-input-date .mobile-input-date-main .date-head span:active img {
  display: inline-block;
  margin-left: 2px;
}
.mobile-input-date .mobile-input-date-main .date-head span:active img:nth-of-type(1) {
  display: none;
}
.mobile-input-date .mobile-input-date-main .date-head span.date-head-double-left img {
  -webkit-transform: scale(-1, 1);
          transform: scale(-1, 1);
}
.mobile-input-date .mobile-input-date-main .date-head span.date-head-left {
  margin-left: ${processPix(0.2)};
}
.mobile-input-date .mobile-input-date-main .date-head span.date-head-left img {
  -webkit-transform: scale(-1, 1);
          transform: scale(-1, 1);
}
.mobile-input-date .mobile-input-date-main .date-head span.date-head-right {
  margin-right: ${processPix(0.2)};
}
.mobile-input-date .mobile-input-date-main .date-head .date-head-title {
  display: inline-block;
  width: ${processPix(3.78)};
  font-size: ${processPix(0.42)};
  text-align: center;
}
.mobile-input-date .mobile-input-date-main .date-head .date-head-title .date-head-year {
  width: ${processPix(1.6)};
}
.mobile-input-date .mobile-input-date-main .date-head .date-head-title .date-head-month {
  width: ${processPix(1)};
}
.mobile-input-date .mobile-input-date-main .date-head .date-head-title em {
  height: ${processPix(1.2)};
  font-style: normal;
  line-height: ${processPix(1.2)};
}
.mobile-input-date .mobile-input-date-main .date-body {
  height: ${processPix(9.1)};
  padding-left: ${processPix(0.4629)};
}
.mobile-input-date .mobile-input-date-main .date-body > * {
  height: 100%;
}
.mobile-input-date .mobile-input-date-main .date-body > * span {
  display: inline-block;
  text-align: center;
  border-radius: 4px;
}
.mobile-input-date .mobile-input-date-main .date-body > * span:hover,
.mobile-input-date .mobile-input-date-main .date-body > * span.active {
  color: #fff;
  background: #39f;
}
.mobile-input-date .mobile-input-date-main .date-body .picker-year-cell span,
.mobile-input-date .mobile-input-date-main .date-body .picker-month-cell span {
  width: ${processPix(1.84)};
  height: ${processPix(1.3)};
  margin: ${processPix(0.46)} ${processPix(0.56)};
  line-height: ${processPix(1.3)};
}
.mobile-input-date .mobile-input-date-main .date-body .picker-day-cell span {
  width: ${processPix(1.1)};
  height: ${processPix(1.1)};
  margin: ${processPix(0.1)};
  line-height: ${processPix(1.1)};
}
.mobile-input-date .mobile-input-date-main .date-body .picker-day-cell span.picker-cell-cor-gray {
  color: #c3cbd6;
  background: #fff;
}`;

    let style = document.getElementById('style-for-mobile-input-date');
    if (style) {
        return;
    }
    style = document.createElement('style');
    style.id = 'style-for-mobile-input-date';
    style.appendChild(document.createTextNode(styleStr));
    document.head.appendChild(style);
}
</script>

<style lang="less">
/* 将 css 通过 js 生成
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
  .hidden {
    visibility: hidden;
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
        border: 1px solid transparent;

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
          border-color: rgba(132, 215, 239, 0.8);
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
*/
</style>
