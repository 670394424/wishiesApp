const $= getApp().globalData.$,
    date = new Date(),
    years = [],
    months = [],
    days = [];

for (let i = 1960; i <= date.getFullYear(); i++) {
    years.push(i)
}

for (let i = 1 ; i <= 12; i++) {
    months.push(i)
}

for (let i = 1 ; i <= 31; i++) {
    days.push(i)
}

Page({
    data:{
        stockData:[],
        stockTotal:{},
        years: years,
        startYear: date.getFullYear(),
        endYear: date.getFullYear(),
        months: months,
        startMonth: $.util.formatNumber(date.getMonth()+1),
        endMonth: $.util.formatNumber(date.getMonth()+1),
        days: days,
        startDay: $.util.formatNumber(date.getDate()),
        endDay: $.util.formatNumber(date.getDate()),
        startValue: [date.getFullYear(), date.getMonth(), date.getDate()-1],
        endValue:[date.getFullYear(), date.getMonth(), date.getDate()-1],
        startDateSel:false,
        endDateSel:false,
        maskShow:false,
        paperTypeShow:false,
        navActive:0,
        paperValue:['纸票','半年电票','一年电票','半年财务电票','一年财务电票','半年商业电票','一年商业电票','电票','财票','商票'],
        paperValues:0,
        paperVal:'纸票',
        page:1,
        size:6,
        dataObj:{},
        nBuyDiscountStart:'',
        nBuyDiscountEnd:'',
        nNumber:'',
        nMoneyStart:'',
        nMoneyEnd:'',
        reachBtn:false
    },
    onLoad(){
        console.log(getCurrentPages())
        let personalData = wx.getStorageSync('loginData'),
            dataObj={
                plusId:personalData.plusId,
                plusType:personalData.plusType,
                page:1,
                size:6,
                nTemStatus:this.data.navActive
            };
        this.setData({
            personalData:personalData,
            dataObj:dataObj
        });
        this.stockRequest()
    },
    inventoryTap(){
        let dataObj=this.data.dataObj;
        dataObj.nNumber='';
        dataObj.nType='';
        dataObj.nMoneyStart='';
        dataObj.nMoneyEnd='';
        dataObj.nBuyDiscountStart='';
        dataObj.nBuyDiscountEnd='';
        dataObj.startTime='';
        dataObj.endTime='';
        dataObj.nTemStatus=0;
        dataObj.page=1;
        this.setData({
            navActive:0,
            dataObj:dataObj,
            stockData:[],
            reachBtn:false,
            paperValues:0,
            paperVal:'纸票'
        })
        this.stockRequest();
    },
    temporaryTap(){
        let dataObj=this.data.dataObj;
        dataObj.nNumber='';
        dataObj.nType='';
        dataObj.nMoneyStart='';
        dataObj.nMoneyEnd='';
        dataObj.nBuyDiscountStart='';
        dataObj.nBuyDiscountEnd='';
        dataObj.startTime='';
        dataObj.endTime='';
        dataObj.nTemStatus=1;
        dataObj.page=1;
        this.setData({
            navActive:1,
            dataObj:dataObj,
            stockData:[],
            reachBtn:false,
            paperValues:0,
            paperVal:'纸票'
        })
        this.stockRequest();
    },
    shortTap(){
        let dataObj=this.data.dataObj;
        dataObj.nNumber='';
        dataObj.nType='';
        dataObj.nMoneyStart='';
        dataObj.nMoneyEnd='';
        dataObj.nBuyDiscountStart='';
        dataObj.nBuyDiscountEnd='';
        dataObj.startTime='';
        dataObj.endTime='';
        dataObj.nTemStatus=2;
        dataObj.page=1;
        this.setData({
            navActive:2,
            dataObj:dataObj,
            stockData:[],
            reachBtn:false,
            paperValues:0,
            paperVal:'纸票'
        })
        this.stockRequest();
    },
    peperBtnShow(){
        this.setData({
            maskShow:true,
            paperTypeShow:true
        })
    },
    hideShade(){
        this.setData({
            startDateSel:false,
            endDateSel:false,
            maskShow:false,
            paperTypeShow:false
        })
    },
    bindUserSortChange(e){
        let val = e.detail.value;
        this.setData({
            paperValues:val
        })
    },
    bindUserSortEns(){
        let value=this.data.paperValues;
        this.setData({
            paperVal:this.data.paperValue[value]
        })
    },
    startBtn(){
        this.setData({
            maskShow:true,
            startDateSel:true
        })
    },
    bindStartChange(e){
        let val = e.detail.value;
        this.setData({
            startValue:val
        })
    },
    bindStartEns(){
        let val=this.data.startValue;
        this.setData({
            startYear: this.data.years[val[0]],
            startMonth: $.util.formatNumber(this.data.months[val[1]]),
            startDay: $.util.formatNumber(this.data.days[val[2]]),
            maskShow:false,
            startDateSel:false
        })
    },
    endBtn(){
        this.setData({
            maskShow:true,
            endDateSel:true
        })
    },
    bindEndChange(e){
        let val = e.detail.value;
        this.setData({
            endValue:val
        })
    },
    bindEndEns(){
        let val=this.data.endValue;
        this.setData({
            endYear: this.data.years[val[0]],
            endMonth: $.util.formatNumber(this.data.months[val[1]]),
            endDay: $.util.formatNumber(this.data.days[val[2]]),
            endShow:false,
            endDateSel:false
        })
    },
    paperSerialNum(e){
        let val=e.detail.value;
        this.setData({
            nNumber:val
        })
    },
    MoneyStart(e){
        let val=e.detail.value;
        this.setData({
            nMoneyStart:val
        })
    },
    MoneyEnd(e){
        let val=e.detail.value;
        this.setData({
            nMoneyEnd:val
        })
    },
    discountStart(e){
        let val=e.detail.value;
        this.setData({
            nBuyDiscountStart:val
        })
    },
    discountEnd(e){
        let val=e.detail.value;
        this.setData({
            nBuyDiscountEnd:val
        })
    },
    stockQuery(){
        let dataObj=this.data.dataObj,
            _this=this,
            navActive=this.data.navActive;
        dataObj.nNumber=this.data.nNumber || '';
        dataObj.nType=this.data.paperValues || '';
        dataObj.nMoneyStart=this.data.nMoneyStart || '';
        dataObj.nMoneyEnd=this.data.nMoneyEnd || '';
        if(navActive==0){
            dataObj.nBuyDiscountStart=_this.data.nBuyDiscountStart || '';
            dataObj.nBuyDiscountEnd=_this.data.nBuyDiscountEnd || '';
            dataObj.startTime=this.data.startYear.toString()+"-"+this.data.startMonth.toString()+"-"+this.data.startDay.toString() || '';
            dataObj.endTime=this.data.endYear.toString()+"-"+this.data.endMonth.toString()+"-"+this.data.endDay.toString() || '';
        }
        this.setData({
            dataObj:dataObj,
            stockData:[],
            reachBtn:false
        });
        console.log('as',this.data.nNumber);
        this.stockRequest();
    },
    stockRequest(){
        let dataObj=this.data.dataObj,_this=this,
            reachBtn=this.data.reachBtn,
            stockData=this.data.stockData,
            stockTotal=this.data.stockTotal;
        console.log('2222222222',stockData)
        if(!reachBtn){
            $.common('noteBankPlusManager//note/findNoteListWechat.htm',dataObj,function (res,resData) {
                    console.log("获取成功",res);
                    console.log("获取成功",resData);
                    console.log("获取成功",_this.data.stockData);
                    if(res.length){
                        for(let item of res){
                            stockData.push(item)
                        }
                        _this.setData({
                            stockData:stockData,
                            stockTotal:resData.total
                        });
                        console.log('222222',_this.data.stockData);
                        if(res.length<6){
                            wx.showToast({
                                title: '已全部加载',
                                icon: 'success',
                                duration: 1000
                            });
                            _this.setData({
                                reachBtn:true
                            })
                        }
                    }else{
                        wx.showToast({
                            title: '查询无结果',
                            icon: 'none',
                            duration: 1000
                        })
                        _this.setData({
                            stockData:stockData,
                            stockTotal:resData.total
                        })
                    }
                },function (err) {
                    console.log("获取失败",err)
                }
            )
        }
    },
    onReachBottom(){
        console.log('111')
        let _this=this,
            dataObj=this.data.dataObj,
            reachBtn=this.data.reachBtn;
        if(!reachBtn){
            dataObj.page++;
            this.setData({
                dataObj:dataObj
            });
            this.stockRequest()
        }
    }
})