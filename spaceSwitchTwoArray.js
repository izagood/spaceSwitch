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

    const originlist = ['권시연', '김예은', '김예진', '김재영', '노유림', '민지홍',
        '박윤재', '이소현', '이재빈', '이지현', '임정환', '정우리'];
    let nowList = [];
    let HistoryObject = {};

    /* 
        @param membersList 맴버 수
        @param groups 그룹 수

        맴버 수와 그룹 수에 맞게 2차 배열을 반환해준다.
    */
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
    const groupObjCreate = function (membersList, groups) {
        // 객체 초기화
        let jsonObj = {};
        const array = templateCreate(membersList, groups);
        // key : value 형태로 객체 생성
        for (var lp1 = 0; lp1 < membersList.length; lp1++) {
            jsonObj[membersList[lp1]] = array;
        }
        return jsonObj;
    };
    /* 
        @param initList 초기 list
        @param initGroups 초기 그룹 수

        초기 세팅이 되는 부분
    */
    const createInit = function(initList, initGroups) { 
        HistoryObject = groupObjCreate(initList, initGroups);
        nowList = initList;
    };

    /* 
        @param ListParam list형태의 변수
        @param changeListToFormGroups 그룹 수

        기존 list를 그룹 형식에 맞는 2차 배열로 변환한다.

        히스토리에서 사용할 때 list를 groupObj 형식과 비교할 수 있게 사용한다.
    */
    const changeListToForm = function (ListParam, changeListToFormGroups) {
        let templateList = templateCreate(ListParam, changeListToFormGroups);
        var count1 = 0;
        for (var lp1 = 0; lp1 < templateList.length; lp1++) {
            for (var lp2 = 0; lp2 < templateList[lp1].length; lp2++) {
                templateList[lp1][lp2] = ListParam[count1];
                count1++
            }
        }
        return templateList;
    };

    /*
        @param formParam Form형식으로된 리스트

        renderList하기 전에 templateForm으로 들어가 있는걸 일반 list로 쭉 배열
    */
    const changeFormToList = function (formParam) {
        let forRenderList = [];


        return forRenderList;
    };
    
    // ------------------------히스토리 관련 함수-------------------------------
    /* 
        자리 히스토리
        @param itemHistoryObj 기록이 저장될 object
        @param itemHistoryKey 맴버 이름
        @param itemHistoryGroupValue 배열의 그룹 값
        @param itemHistoryPlaceValue 그룹에서의 위치 값

        params들을 받아서 해당 위치를 false로 변경해 줌.
        초기화 했던 Obj에 하나씩 false로 바꾸면서 히스토리를 만든다.
    */
    const itemHistory = function (itemHistoryObj, itemHistoryKey, itemHistoryGroupValue, itemHistoryPlaceValue) {
        itemHistoryObj[itemHistoryKey][itemHistoryGroupValue][itemHistoryPlaceValue] = false;
    }

    /* 
        모든 히스토리가 false인지 체크하고 모두 false라면 모두 true로 변경해준다.
    */
    const allHistoryFalseCheck = function () {

    };
    // ------------------------히스토리 관련 함수-------------------------------

    // ------------------------셔플 관련 함수-------------------------------
    /*
        @param min min 이상의 정수
        @param max max 미만의 정수

        만약 min = 0 , max = 3 이면 0,1,2가 나옴
    */
    const randomIntMinMax = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
    /* 
        @param max max 미만의 0이상의 정수
    */
    const randomIntMax = function (max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    
    /* 
        @param shuffleListParam list형태 

        조건을 맞춘 랜덤 구현
        랜덤으로 자리를 배치함
        1. 앉지 않았던 분단을 우선으로 배치함  
        ex) 최초 자리배치 후 A가 1분단 1열에 배치되었다면 그다음 자리배치할때는 2,3분단이 우선이 되도록 랜덤 자리 배치  
        
        1. 앉았던 자리에는 배치가 안되도록  
        그러면 총 12번까지는 자리를 배치할수 있겠죠?

        근데 이게 shuffle을 돌릴 때 히스토리를 조사해서 돌린 최종 list가 나와야함.
    */
    const shuffle = function (shuffleListParam) {
        itemHistory();
        let shuffleList = [];

        nowList = shuffleList;
        return shuffleList;
    };
    // ------------------------셔플 관련 함수-------------------------------


    /* 
        그냥 list 형태로 들어옴
        render
    */
    const renderList = function (renderListFormattingParam) {
        for (var i in renderListFormattingParam) {
            $('li').eq(i).text(renderListFormattingParam[i]);
        }
    }

    /* 
        초기화를 하고 처음 섞어서(shuffle) 기록(itemHistory) 후
        
        renderList
    */
    $("#setSeat").on("click", function () {
        createInit(originlist, 3);
        var nowRenderList = shuffle(nowList);
        renderList(nowRenderList);
    });
    /* 
    섞어서(shuffle) 기록(itemHistory) 후 
    
    renderList
    */
   $("#randomSeat").on("click", function () {
       var nowRenderList = shuffle(nowList);
       renderList(nowRenderList);
    });
});