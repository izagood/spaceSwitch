/* 

2차원 배열에 true로 할당하고
ex) 3개 그룹 3명씩
var array = 
[
    [true,true,true]
    [true,true,true]
    [true,true,true]
]
현재 1차 배열 위치 할당하고
ex) array[0]
해당 배열의 2차 배열에 자리 false로 변경
ex) 만약 3번째 자리라면
array[0][2] = false;
다음에 그룹을 정할 때
현재 1차 배열 위치를 제외한 다른 곳에 다음에 할당해야 함.
ex ) 이전에 array[0] 이였으므로
array[1] or array[2] 의 2차 배열에 할당
랜덤으로 뽑힌 그룹의 배열이 모두 false이면 다른 그룹에 할당
ex ) array[1]이 뽑혔는데
array[1][0] == false
array[1][1] == false
array[1][2] == false
이면
array[2] 의 각 2차배열에 true가 있는지 체크하고
그래도 모두 false라면
현재 배열 array[0]중에 true인 곳에 할당
*/

$(document).ready(function () {
    // 연결 log 
    const hi = '연결 성공';
    console.log(hi);

    const list = ['권시연', '김예은', '김예진', '김재영', '노유림', '민지홍', 
    '박윤재', '이소현', '이재빈', '이지현', '임정환', '정우리'];

    const templateCreate = function (membersList, groups) {
        // value에 넣어줄 배열 생성
        let outArr = [];
        let inArr = [];
        const membersListLength = membersList.length;
        let maxGroupMembers;
        let minGroupMembers;
        const remainderGroupMembers = membersListLength % groups;

        if (membersListLength < groups) {
            var count1 = 0;

            for (var lp1 = 0; lp1 < groups; lp1++) {
                if (count1 < membersListLength) {
                    inArr.push(true);
                    count1++;
                } else {
                    inArr = undefined;
                }
                outArr.push(inArr);
                inArr = []
            }
        } else {
            // 0으로 떨어지면 maxGroupMembers 만큼 돌면서 push해주면 됨
            if (membersListLength % groups == 0) {
                maxGroupMembers = Math.floor(membersListLength / groups);

                for (var lp2 = 0; lp2 < groups; lp2++) {

                    for (var lp3 = 0; lp3 < maxGroupMembers; lp3++) {
                        inArr.push(true);
                    }
                    outArr.push(inArr);
                    inArr = []
                }
            } else {
                // 0으로 떨어지지 않으면 maxGroupMembers + 1 만큼 돌면서 push 하고
                // remainderGroupMembers 만큼 -1하여 push한다.
                maxGroupMembers = Math.floor(membersListLength / groups) + 1;
                minGroupMembers = Math.floor(membersListLength / groups);
                var count2 = 0;

                for (var lp4 = 0; lp4 < groups; lp4++) {
                    if (count2 < remainderGroupMembers) {
                        for (var lp5 = 0; lp5 < maxGroupMembers; lp5++) {
                            inArr.push(true);
                        }
                        count2++;
                    } else {
                        for (var lp6 = 0; lp6 < minGroupMembers; lp6++) {
                            inArr.push(true);
                        }
                    }
                    outArr.push(inArr);
                    inArr = []
                }
            }
        }
        return outArr;
    };

    /*
        @param membersList : 맴버들 리스트
        @param groups : 몇 개 그룹으로 만들껀지
        
        만약에 수가 맞지 않으면 순차적으로 적게 들어간다.
        
        json 객체로 만들어 지는데 jsonObj에 key = 사람, value = 2차원 배열
        
    */
    const groupCreate = function (membersList, groups) {
        // 객체 초기화
        let jsonObj = {};
        const array = templateCreate(membersList, groups);
        // key : value 형태로 객체 생성
        for (var lp1 = 0; lp1 < membersList.length; lp1++) {
            jsonObj[membersList[lp1]] = array;
        }
        return jsonObj;
    };
    
    // 기존 리스트를 그룹별 형식에 맞는 2차 배열로 변환한다.
    const changeListToForm = function(ListParam, changeListToFormGroups){
        let templateList = templateCreate(ListParam, changeListToFormGroups);
        var count1 = 0;
        for(var lp1=0; lp1<templateList.length; lp1++){
            for(var lp2=0; lp2<templateList[lp1].length; lp2++){
                templateList[lp1][lp2] = ListParam[count1];
                count1++
            }
        }
        return templateList;
    };

    const changeFormToList = function(){

        retrun 
    };

    /* 자리 히스토리
    @param itemHistoryObj 기록이 저장될 object
    @param itemHistoryKey 맴버 이름
    @param itemHistoryGroupValue 배열의 그룹 값
    @param itemHistoryPlaceValue 그룹에서의 위치 값

    params들을 받아서 해당 위치를 false로 변경해 줌.
    */
    const itemHistory = function (itemHistoryObj, itemHistoryKey, itemHistoryGroupValue, itemHistoryPlaceValue) {
        itemHistoryObj[itemHistoryKey][itemHistoryGroupValue][itemHistoryPlaceValue] = false;
    }

    /* 
        조건을 맞춘 랜덤 구현
    */
    const shuffle = function () {
        let shuffleList = [];

        return shuffleList;
    };

    
    /* 
        render
    */
    const renderList = function (renderListFormattingParam) {
        for (var i in renderListFormattingParam) {
            $('li').eq(i).text(renderListFormattingParam[i]);
        }
    }

    /* 
        초기화를 하고 처음 섞어서 기록 후
        
        render
    */
    $("#setSeat").on("click", function () {
        let object = groupCreate(list, 3);
        renderList(list);
    });
    /* 
        섞어서 기록 후 
        
        render
    */
    $("#randomSeat").on("click", function () {
        renderList(list);
    });
});