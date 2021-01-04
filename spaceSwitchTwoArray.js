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

    const originList = ['권시연', '김예은', '김예진', '김재영', '노유림', '민지홍',
        '박윤재', '이소현', '이재빈', '이지현', '임정환', '정우리'
    ];
    let nowList = [];
    let historyObject = {};

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
        // key : value 형태로 객체 생성
        for (var lp1 = 0; lp1 < membersList.length; lp1++) {
            jsonObj[membersList[lp1]] = templateCreate(membersList, groups);
        }
        return jsonObj;
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
        for (var lp1 = 0; lp1 < formParam.length; lp1++) {
            for (var lp2 = 0; lp2 < formParam[lp1].length; lp2++) {
                forRenderList.push(formParam[lp1][lp2]);
            }
        }

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
    const oneItemHistory = function (itemHistoryObj, itemHistoryKey, itemHistoryGroupValue, itemHistoryPlaceValue) {
        itemHistoryObj[itemHistoryKey][itemHistoryGroupValue][itemHistoryPlaceValue] = false;
    }
    /* 
        자리 히스토리
        @param itemHistoryObj 기록이 저장될 object
        @param itemHistoryFormList 기록될 리스트

        params들을 받아서 해당 위치를 false로 변경해 줌.
        초기화 했던 Obj에 하나씩 false로 바꾸면서 히스토리를 만든다.

        자리 히스토리
        formatting된 리스트가 들어오면 한번에 히스토리 정리
    */
    const listItemHistory = function (itemHistoryObj, itemHistoryFormList) {
        for (var lp1 = 0; lp1 < itemHistoryFormList.length; lp1++) {
            for (var lp2 = 0; lp2 < itemHistoryFormList[lp1].length; lp2++) {

                oneItemHistory(itemHistoryObj, itemHistoryFormList[lp1][lp2], lp1, lp2);
            }
        }

    }

    /* 
        @param checkObj 체크해야할 obj
        @param checkList for문 돌리기 위한 list
        @param groups 그룹 수
        @param checkBoolean 체크할 boolean
    
        모든 히스토리가 checkBoolean으로 되어있는지 체크
    */
    const allHistoryCheck = function (checkObj, checkList, checkBoolean) {
        let allFlag = true;

        // boolean이 하나라도 있는지 체크해야 하므로 입력 값과 반대로 바꿔줘야 한다.
        if (checkBoolean == true) {
            checkBoolean = false;
        } else {
            checkBoolean = true;
        }

        for (var lp1 = 0; lp1 < checkList.length; lp1++) {
            for (var lp2 = 0; lp2 < checkObj[checkList[lp1]].length; lp2++) {
                for (var lp3 = 0; lp3 < checkObj[checkList[lp1]][lp2].length; lp3++) {
                    if (checkObj[checkList[lp1]][lp2][lp3] == checkBoolean) {
                        allFlag = false;
                    }
                }
            }
        }

        return allFlag;
    };
    // ------------------------히스토리 관련 함수-------------------------------

    // ------------------------셔플 관련 함수-------------------------------
    /* 
        @param max max 미만의 0이상의 정수
    */
    const randomIntMax = function (max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    const remainderIndex = function (indexList) {
        let remainList = [];
        var count1 = 0;
        for (var lp1 = 0; lp1 < indexList.length; lp1++) {
            if (indexList[lp1] == true) {
                remainList[count1] = lp1;
                count1++;
            }
        }

        return remainList;
    };

    const noLimitRandomList = function (listParam) {
        let noLimitRandom = [];
        let noLimitRandomIndex = [];
        let noLimitRandomIndexRemainder = [];

        // index할당
        for (var lp1 = 0; lp1 < listParam.length; lp1++) {
            noLimitRandomIndex.push(true);
        }

        // 순서대로 돌리면서 넣는데 들어가는 곳이 랜덤
        for (var lp2 = 0; lp2 < listParam.length; lp2++) {
            //남아있는 index 배열
            noLimitRandomIndexRemainder = remainderIndex(noLimitRandomIndex);
            //남은 index중에 random으로 정해진 index를 골라 해당 index에 해당하는 위치에 할당
            let randomIndexPick = randomIntMax(noLimitRandomIndexRemainder.length);
            let randomPick = noLimitRandomIndexRemainder[randomIndexPick];
            noLimitRandom[randomPick] = listParam[lp2];
            //현재 채워진 index에 false를 할당
            noLimitRandomIndex[randomPick] = false;
        }

        return noLimitRandom;
    }

    const twoArrayRemainderIndex = function (twoArrayIndexList) {
        let remain1Array = [];
        let remain2Array = [];

        for (var lp1 = 0; lp1 < twoArrayIndexList.length; lp1++) {
            for (var lp2 = 0; lp2 < twoArrayIndexList[lp1].length; lp2++) {
                if (twoArrayIndexList[lp1][lp2] == true) {
                    remain2Array.push(lp2);
                }
            }
            remain1Array.push(remain2Array);
            remain2Array = [];
        }

        return remain1Array;
    };

    const findNowGroup = function (findNowGroupList, findNowGroupMemberName) {
        let findNowGroupNum = 0;

        let findNowListForm = changeListToForm(findNowGroupList, 3);
        // nowList에서 현재의 그룹을 찾고 이외의 그룹에서 돌려야 함.
        for (var lp1 = 0; lp1 < findNowListForm.length; lp1++) {
            for (var lp2 = 0; lp2 < findNowListForm[lp1].length; lp2++) {
                if (findNowListForm[lp1][lp2] == findNowGroupMemberName) {
                    findNowGroupNum = lp1;
                }
            }
        }
        return findNowGroupNum;
    }

    /* 
        @param shuffleListParam list형태 
        @param shuffleGroupParam 그룹 수 

        조건을 맞춘 랜덤 구현
        1. 랜덤으로 자리를 배치함
        1. 앉지 않았던 분단을 우선으로 배치함  
        ex) 최초 자리배치 후 A가 1분단 1열에 배치되었다면 그다음 자리배치할때는 2,3분단이 우선이 되도록 랜덤 자리 배치  
        
        1. 앉았던 자리에는 배치가 안되도록  
        그러면 총 12번까지는 자리를 배치할수 있겠죠?

        근데 이게 shuffle을 돌릴 때 히스토리를 조사해서 돌린 최종 list가 나와야함.
    */
    const shuffle = function (historyParam, shuffleListParam, shuffleGroupParam) {
        // shuffle에서 할당 유무를 판단하는 template, 외부 history
        let outterHistoryIndexRemainder = [];
        // 내부 히스토리
        let innerHistoryIndex = templateCreate(shuffleListParam, shuffleGroupParam);
        let innerHistoryIndexRemainder = [];
        // 내부 리스트
        let innerShuffleList = [];
        let innerShuffleListForm = templateCreate(shuffleListParam, shuffleGroupParam);
        // 외부 history

        // 모두 true 일때
        if (allHistoryCheck(historyParam, shuffleListParam, true) == true) {
            // 랜덤으로 돌리고 배정해줘야 함.
            innerShuffleList = noLimitRandomList(originList);
            innerShuffleListForm = changeListToForm(innerShuffleList, 3);

            //shuffleList에 지금 할당된걸 historyObject에 기록해야 함.
            listItemHistory(historyParam, innerShuffleListForm);
        } else {
            // 모두 false 일때
            if (allHistoryCheck(historyParam, shuffleListParam, false) == true) {
                //히스토리 초기화
                historyObject = groupObjCreate(shuffleListParam, shuffleGroupParam);
                // 랜덤 배정 후 히스토리 기록을 위해 formatting
                innerShuffleList = noLimitRandomList(originList);
                innerShuffleListForm = changeListToForm(innerShuffleList, 3);
                //shuffleList에 지금 할당된걸 historyObject에 기록해야 함.
                listItemHistory(historyParam, innerShuffleListForm);

            } else { // true, false 섞여있을때
                // 각 사람별 가능한거 뽑아서 남은 자리에 배정
                for (var lp1 = 0; lp1 < shuffleListParam.length; lp1++) {
                    // 외부 히스토리 남은거
                    outterHistoryIndexRemainder = twoArrayRemainderIndex(historyParam[shuffleListParam[lp1]]);

                    let nowGroup = findNowGroup(nowList, shuffleListParam[lp1]);
                    let groupIndexPick = randomIntMax(outterHistoryIndexRemainder.length);
                    while (groupIndexPick == nowGroup) {
                        groupIndexPick = randomIntMax(outterHistoryIndexRemainder.length);
                    }
                    //현재의 그룹을 제외한 다른 곳에 들어가야함
                    // 외부 히스토리는 만족하고 있지만 내부 히스토리가 불만족.
                    // 내부 히스토리에 값이 있는 경우 다시 한번 픽하는 알고리즘 필요
                    // 랜덤으로 했을때 10번 이상 안 들어가면 수동으로 들어가게 해야할듯
                    let twoArrayRandomIndexPick = randomIntMax(outterHistoryIndexRemainder[groupIndexPick].length);
                    // console.log('twoArrayRandomIndexPick', twoArrayRandomIndexPick);
                    let twoArrayRandomPick = outterHistoryIndexRemainder[groupIndexPick][twoArrayRandomIndexPick];
                    // console.log('twoArrayRandomPick', twoArrayRandomPick);
                    // 내부 히스토리 == shuffleFromHistoryIndex
                    if (innerHistoryIndex[groupIndexPick][twoArrayRandomPick] == true) {
                        innerShuffleListForm[groupIndexPick][twoArrayRandomPick] = shuffleListParam[lp1];
                        innerHistoryIndex[groupIndexPick][twoArrayRandomPick] = false;
                        // console.log('innerHistoryIndex', innerHistoryIndex);
                    } else {
                        // innerHistoryIndexRemainder 이너에도 남은거에서 순서로 돌려야함.
                        // 외부 내부 둘 다 true 인것 찾아야함.
                        // 위에서 true였지만 내부 히스토리에 false이기 때문에
                        // 내부 히스토리만 true한다고 해서 외부가 false일 수 있음
                        // 결국 공통으로 true인 경우를 골라 내는 함수가 필요함.
                        console.log('else로 들어왔다')
                        innerHistoryIndexRemainder = twoArrayRemainderIndex(innerHistoryIndex);
                        for (var lp2 = 0; lp2 < innerHistoryIndexRemainder[groupIndexPick].length; lp2++) {
                            innerShuffleListForm[groupIndexPick][lp2] = shuffleListParam[lp1];
                            innerHistoryIndex[groupIndexPick][lp2] = false;
                        }

                    }
                }
                listItemHistory(historyParam, innerShuffleListForm);
            }
        }

        nowList = changeFormToList(innerShuffleListForm);
        return nowList;
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
        historyObject = groupObjCreate(originList, 3);
        nowList = originList
        var nowRenderList = shuffle(historyObject, nowList, 3);
        renderList(nowRenderList);
        console.log('historyObject', historyObject)
    });
    /* 
    섞어서(shuffle) 기록(itemHistory) 후 
    
    renderList
    */
    $("#randomSeat").on("click", function () {
        var nowRenderList = shuffle(historyObject, nowList, 3);
        renderList(nowRenderList);
        console.log('historyObject', historyObject)
    });
});