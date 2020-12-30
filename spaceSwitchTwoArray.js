/* 

2차원 배열에 true로 할당하고
현재 1차 배열 위치 할당하고
현재 1차 배열 위치를 제외한 다른 곳에 다음에 할당해야 함.
랜덤으로 뽑힌 그룹의 배열이 모두 false이면 다른 그룹에 할당

일반적으로 사용할 수 있는 기능으로 만들자.
*/

$(document).ready(function () {

    const list = ['권시연', '김예은', '김예진', '김재영', '노유림', '민지홍', '박윤재', '이소현', '이재빈', '이지현', '임정환', '정우리'];
    const hi = '연결 성공';
    console.log(hi);

    const arrayCreate = function (membersList, groups) {
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
        const array = arrayCreate(membersList, groups);
        // key : value 형태로 객체 생성
        for (var lp1 = 0; lp1 < membersList.length; lp1++) {
            jsonObj[membersList[lp1]] = array;
        }
        return jsonObj;
    };
    
    // 기존 리스트를 그룹별 형식에 맞는 2차 배열로 변환한다.
    const changeListForm = function(changeListFormParam, changeListFormgroups){
        let changeForm = arrayCreate(changeListFormParam, changeListFormgroups);
        var count1 = 0;
        for(var lp1=0; lp1<changeForm.length; lp1++){
            for(var lp2=0; lp2<changeForm[lp1].length; lp2++){
                changeForm[lp1][lp2] = changeListFormParam[count1];
                count1++
            }
        }
        return changeForm;
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

    // render만
    const renderList = function (renderListParam) {
        for (var i in renderListParam) {
            // $('.p1').find('li').eq(1)
            $('li').eq(i).text(renderListParam[i]);
        }
    }

    /* 
        초기화를 하고 처음 섞어서 기록 후
        
        render
    */
    $("#setSeat").on("click", function () {
        let object = groupCreate(list, 3);
        let formattingList = changeListForm(list, 3);
        console.log(formattingList);
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