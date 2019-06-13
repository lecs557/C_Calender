var eventss = [ [3,5,2019,"Ergotherapie","11:30","30"],
                [7,5,2019,"Ergotherapie","13:15","30"],
               [8,5,2019,"Krankengymnastik","17:25","50"] ]


var monthNames = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
var weekNames = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
var monthDays = [31,28,31,30,31,30,31,31,30,31,30,31]
var monthBegin = [1,-2,-2, 2, 0,-3, 2,-1,-4, 1,-2,-4]


class C_Calender {
    constructor(event){
        // elements which form calenderApp
        this.calenderApp = this.crElset("div","id","calenderApp")
        this.calender = this.crElset("div","class","calender")
        this.openedDay = this.crElset("div", "class", "openedDay")
        this.daysEvents =  this.crElset("table","class","daysEvents")

        //other useful variables 
        this.events=event
        this.today = new Date()
        this.month = new Date().getMonth()
        this.year = new Date().getFullYear()


        // structure
        this.calenderApp.append(this.calender)
        this.calender.append( this.createMonthBar() )
        this.calender.append( this.createMonthTable() )
        this.calenderApp.append( this.openedDay)    
        this.openedDay.append(this.daysEvents)
        // /structure
    }
    
    createMonthBar(){
        // elements which form MonthBar
        var monthBar = this.crElset("div", "class", "monthBar")
        var leftBtn = this.crElset("button","class","button")
        var rightBtn = this.crElset("button","class","button")
        var monthtxt = document.createTextNode(monthNames[this.month]+ " " + this.year)
        
        
        // structure
        monthBar.append(leftBtn)
            leftBtn.append(document.createTextNode("<--"))
        monthBar.append(monthtxt)
        monthBar.append(rightBtn)
            rightBtn.append(document.createTextNode("-->"))
        // /structure
        

        var that=this
        monthBar.setAttribute("align","center")
        leftBtn.style.float = "left"
        leftBtn.onclick= function() {that.changeMonth(-1) } 
        rightBtn.style.float ="right"
        rightBtn.onclick= function() {that.changeMonth(1) } 
        return monthBar
    }

    createMonthTable(){
        var calenderTable = this.crElset("table","class","monthTable")
        calenderTable.append(this.createWeekNameRow())
        calenderTable.append(this.createMonthRow(0))
        calenderTable.append(this.createMonthRow(7))
        calenderTable.append(this.createMonthRow(14))
        calenderTable.append(this.createMonthRow(21))
        calenderTable.append(this.createMonthRow(28))
        if(monthBegin[this.month] < -3 && monthDays[this.month ] > 29) {
            calenderTable.append(this.createMonthRow(35))
        }
        return calenderTable

    }

    createWeekNameRow(){
        var weekNameRow = document.createElement("tr")
        for (var i in weekNames) {
            var weekCell = this.crElset("th", "class","weekNames")
            weekCell.append(document.createTextNode(weekNames[i]))
            weekNameRow.append(weekCell)
        }        
        return weekNameRow
    }

    createMonthRow(o){
        // events of each day
        let that = this
        let monthRows = document.createElement("tr") 
        for (let day in weekNames){
           let eve =[]
            monthRows.append(this.writeCell(day,o,that,eve))
        }
        return monthRows
    }

    writeCell(day,o,that,eve){
        let cell = this.crElset("td","class","cell")
         // number which is written in cell
         let cur = monthBegin[this.month] - 2 + parseInt(day) + parseInt(o) 
         if(0 < cur  && cur <= monthDays[this.month]){
            cell.className += " day"
            this.eventORtoday(eve,cur,cell)
            cell.onclick = function() { that.openEvent(eve, cur, day)}
            cell.append(document.createTextNode(cur))
        }
        return cell
    }
        
    eventORtoday(eve,cur,cell){
        for (var i in this.events ){
            if (cur==this.events[i][2] && this.month == this.events[i][1]-1 && this.year == this.events[i][0]) {
                cell.className = "eventDay"
                eve.push(this.events[i])
            }
        }
        if (cur==this.today.getDate() && this.month == this.today.getMonth() && this.year == this.today.getFullYear()) 
            cell.className += " today"
        
    }

    openEvent(eve, curday, weeday) {
        for (var a in this.openedDay.childNodes){
            if(this.openedDay.childNodes[0] != null){
                this.openedDay.childNodes[0].remove()
            }
        }
        if(this.openedDay.childNodes[0] != null){
            this.openedDay.childNodes[0].remove()
        }


        var txt = document.createTextNode(weekNames[weeday]+", den "+curday+". "+monthNames[this.month]+" "+this.year)
        this.openedDay.append(txt)
        var table = document.createElement("table")
        var row = document.createElement("tr")
        var array = ["Name","Uhrzeit","Dauer"]
        for (var j in eve){
            var row2 = document.createElement("tr")
            for(var i in array){
 //               if(j==0){
 //                   var th = document.createElement("th")
//                    th.append(document.createTextNode(array[i]))
//                    row.append(th)
//                    table.append(row)
//                }
                var td = document.createElement("td")
                td.append( document.createTextNode(eve[j][i- -3]))
                row2.append(td)
                table.append(row2)
            }
            this.openedDay.append(table)
        }
    }

    calcyear(d){
        var schlatjahr = this.year%4==0?1:0
        if (schlatjahr){
            monthDays[1]=29
            for (var j in monthBegin){
                if ( j>1)
                    monthBegin[j]+=d
            }
        } else {
            monthDays[1]=28
        }
        for (var j in monthBegin){
            monthBegin[j]+=d
            monthBegin[j] = monthBegin[j]==3?-4:monthBegin[j]
            monthBegin[j] = monthBegin[j]==-5?2:monthBegin[j]
        }
    }

    changeMonth(d){
            this.month+=d
            if (this.month==12){
                this.month=0
                this.year+=1
                this.calcyear(-1)
            } else if (this.month==-1){
                this.month=11
                this.calcyear(1)
                this.year+=-1
            }
            this.calender.childNodes[0].childNodes[1].textContent = monthNames[this.month]+ " "+ this.year
            this.calender.childNodes[1].remove()
            this.calender.append(this.createMonthTable())
    }
  
    show() {
        document.body.append(this.calenderApp)                              
    }

    crElset(el, att, val) {
        let temp = document.createElement(el)
        temp.setAttribute(att,val)
        return temp
    }
}
