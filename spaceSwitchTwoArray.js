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
    const originList = ['권시연', '김예은', '김예진', '김재영', '노유림', '민지홍',
        '박윤재', '이소현', '이재빈', '이지현', '임정환', '정우리'
    ];
    let nowList = [];
    let historyObject = {};
    let shuffleCount = 1;
    let inputGroup = 3;

    // ------------------------형식(form) 관련 함수-------------------------------
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
    // ------------------------형식(form) 관련 함수-------------------------------

    // ------------------------히스토리 관련 함수-------------------------------
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
                itemHistoryObj[itemHistoryFormList[lp1][lp2]][lp1][lp2] = false;
            }
        }
    }

    /* 
        @param checkObj 체크해야할 obj
        @param checkList for문 돌리기 위한 list
        @param checkBoolean 체크할 boolean
    
        모든 히스토리가 checkBoolean으로 되어있는지 체크
    */
    const allHistoryCheck = function (checkObj, checkList, checkBoolean) {
        let allFlag = true;

        for (var lp1 = 0; lp1 < checkList.length; lp1++) {
            for (var lp2 = 0; lp2 < checkObj[checkList[lp1]].length; lp2++) {
                for (var lp3 = 0; lp3 < checkObj[checkList[lp1]][lp2].length; lp3++) {
                    if (checkObj[checkList[lp1]][lp2][lp3] != checkBoolean) {
                        allFlag = false;
                    }
                }
            }
        }

        return allFlag;
    };

    /* 
        @param checkList for문 돌리기 위한 list
        @param checkBoolean 체크할 boolean
    
        모든 히스토리가 checkBoolean으로 되어있는지 체크
    */
    const innerHistoryCheck = function (checkList, checkBoolean) {
        let innnerFlag = true;

        for (var lp1 = 0; lp1 < checkList.length; lp1++) {
            for (var lp2 = 0; lp2 < checkList[lp1].length; lp2++) {
                if (checkList[lp1][lp2] != checkBoolean) {
                    innnerFlag = false;
                }
            }
        }

        return innnerFlag;
    };
    // ------------------------히스토리 관련 함수-------------------------------

    // ------------------------셔플 관련 함수-------------------------------
    /* 
        @param max max 미만의 0이상의 정수
    */
    const randomIntMax = function (max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    /* 
        @param indexList 대상 list
        
        리스트에 남아있는 index 리턴
    */
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

    /* 
        @param listParam 대상 list
        
        리스트가 들어오면 제약조건 없이 랜덤 리스트 리턴
    */
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

    /* 
        @param findNowGroupList 대상 list
        @param findNowGroupMemberName 맴버의 이름
        @param findNowGroupGroups 그룹 수
        
        현재 리스트에서 해당 맴버가 몇 번째 그룹에 있는지 index 리턴
    */
    const findNowGroup = function (findNowGroupList, findNowGroupMemberName, findNowGroupGroups) {
        let findNowGroupNum = 0;

        let findNowListForm = changeListToForm(findNowGroupList, findNowGroupGroups);
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
        @param outterHistory 외부 히스토리
        @param innerHistory 내부 히스토리
        @param nowGroupNum 현재 소속된 그룹

        내외부 히스토리와 현재 소속된 그룹이 아닌 2차 배열 리턴
        
        3가지 조건 모두 만족하는 리스트
    */
    const inOutOtherGroupRemainder = function (outterHistory, innerHistory, nowGroupNum) {
        let inOutTrue1Array = [];
        let inOutTrue2Array = [];

        for (var lp1 = 0; lp1 < outterHistory.length; lp1++) {
            if (nowGroupNum == lp1) {
                inOutTrue1Array.push([]);
            } else {
                for (var lp2 = 0; lp2 < outterHistory[lp1].length; lp2++) {
                    if (outterHistory[lp1][lp2] == true && innerHistory[lp1][lp2] == true) {
                        inOutTrue2Array.push(lp2);
                    }
                }
                inOutTrue1Array.push(inOutTrue2Array);
                inOutTrue2Array = [];
            }
        }

        return inOutTrue1Array;
    };

    /* 
        @param outterHistory 외부 히스토리
        @param nowGroupNum 현재 소속된 그룹
        
        외부 히스토리와 현재 소속된 그룹이 아닌 2차 배열 리턴

        2가지 조건 모두 만족하는 리스트
    */
    const outOtherGroupRemainder = function (outterHistory, nowGroupNum) {
        let outTrue1Array = [];
        let outTrue2Array = [];

        for (var lp1 = 0; lp1 < outterHistory.length; lp1++) {
            if (nowGroupNum == lp1) {
                outTrue1Array.push([]);
            } else {
                for (var lp2 = 0; lp2 < outterHistory[lp1].length; lp2++) {
                    if (outterHistory[lp1][lp2] == true) {
                        outTrue2Array.push(lp2);
                    }
                }
                outTrue1Array.push(outTrue2Array);
                outTrue2Array = [];
            }
        }

        return outTrue1Array;
    };

    /* 
        @param outterHistory 외부 히스토리
        
        현재 소속된 그룹이 아닌 2차 배열 리턴
    */
    const outRemainder = function (outterHistory) {
        let true1Array = [];
        let true2Array = [];

        for (var lp1 = 0; lp1 < outterHistory.length; lp1++) {
            for (var lp2 = 0; lp2 < outterHistory[lp1].length; lp2++) {
                if (outterHistory[lp1][lp2] == true) {
                    true2Array.push(lp2);
                }
            }
            true1Array.push(true2Array);
            true2Array = [];
        }

        return true1Array;
    };

    /* 
        @param trueArray 2차원 배열
        
        현재 true가 남아있는 remainder 2차원 배열에서 각 그룹에 존재하는 수 리턴
    */
    const trueRemainderGroup = function (trueArray) {
        let trueGroupArray = [];

        for (var lp1 = 0; lp1 < trueArray.length; lp1++) {
            if (trueArray[lp1].length !== 0) {
                trueGroupArray.push(lp1);
            }
        }

        return trueGroupArray;
    };

    /* 
        @param checkList 2차원 배열
        
        내부 히스토리에 들어갈 수 있는 자리 수 카운트
    */
    const innerHistoryTrueCount = function (checkList) {
        let innnerTrueCount = 0;

        for (var lp1 = 0; lp1 < checkList.length; lp1++) {
            for (var lp2 = 0; lp2 < checkList[lp1].length; lp2++) {
                if (checkList[lp1][lp2] == true) {
                    innnerTrueCount++;
                }
            }
        }

        return innnerTrueCount;
    };

    /* 
        @param historyParam 외부 히스토리 객체
        @param shuffleListParam 대상 list 
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
        // 내부 히스토리
        let innerHistoryIndex = templateCreate(shuffleListParam, shuffleGroupParam);
        // 내부 리스트
        let innerShuffleList = [];
        let innerShuffleListForm = templateCreate(shuffleListParam, shuffleGroupParam);

        // 모두 true 일때
        if (allHistoryCheck(historyParam, shuffleListParam, true) == true) {
            // 랜덤으로 돌리고 배정해줘야 함.
            innerShuffleList = noLimitRandomList(originList);
            innerShuffleListForm = changeListToForm(innerShuffleList, shuffleGroupParam);

            //shuffleList에 지금 할당된걸 historyObject에 기록해야 함.
            listItemHistory(historyParam, innerShuffleListForm);
            console.log('historyParam', historyParam)
        } else {
            // 모두 false 일때
            if (allHistoryCheck(historyParam, shuffleListParam, false) == true) {
                //히스토리 초기화
                historyObject = groupObjCreate(shuffleListParam, shuffleGroupParam);
                historyParam = historyObject;
                // 랜덤 배정 후 히스토리 기록을 위해 formatting
                innerShuffleList = noLimitRandomList(originList);
                innerShuffleListForm = changeListToForm(innerShuffleList, shuffleGroupParam);
                //shuffleList에 지금 할당된걸 historyObject에 기록해야 함.
                listItemHistory(historyParam, innerShuffleListForm);
                console.log('historyParam', historyParam)

            } else { // true, false 섞여있을때
                //마지막 순서일때 판단.
                if (shuffleCount < nowList.length - 1) {
                    // 각 사람별 가능한거 뽑아서 남은 자리에 배정
                    for (var lp1 = 0; lp1 < shuffleListParam.length; lp1++) {
                        let nowMember = shuffleListParam[lp1];
                        let compareCount = innerHistoryTrueCount(innerHistoryIndex);
                        let nowCount;
                        let loopCount = 0;
                        while ((compareCount - 1) != nowCount) {

                            let nowGroup = findNowGroup(nowList, nowMember, shuffleGroupParam);
                            let inOutGroupRemainderFormList = inOutOtherGroupRemainder(historyParam[nowMember], innerHistoryIndex, nowGroup);
                            let groupPickParam = trueRemainderGroup(inOutGroupRemainderFormList);
                            if (groupPickParam.length === 0) {
                                if (innerHistoryCheck(innerHistoryIndex, false) == false) {
                                    let outGroupRemainderFormList = outOtherGroupRemainder(historyParam[nowMember], nowGroup);
                                    let groupPickParam2 = trueRemainderGroup(outGroupRemainderFormList);
                                    if (groupPickParam2.length === 0 || loopCount > 3) {
                                        if (innerHistoryCheck(innerHistoryIndex, false) == false) {
                                            let outRemainderFormList = outRemainder(historyParam[nowMember]);
                                            let groupPickParam3 = trueRemainderGroup(outRemainderFormList);
                                            let groupPick = groupPickParam3[randomIntMax(groupPickParam3.length)];
                                            // 버그1?
                                            let placePick = outRemainderFormList[groupPick][randomIntMax(outRemainderFormList[groupPick].length)];

                                            if (innerShuffleListForm[groupPick][placePick] == true) {

                                                innerShuffleListForm[groupPick][placePick] = nowMember;
                                                innerHistoryIndex[groupPick][placePick] = false;
                                            } else {
                                                var temp = innerShuffleListForm[groupPick][placePick]
                                                innerShuffleListForm[groupPick][placePick] = nowMember;

                                                nowMember = temp;
                                            }
                                        }
                                    } else {
                                        loopCount++;
                                        // 랜덤 픽 할때 있는 애만 골라야 함
                                        let randomGroupPick = groupPickParam2[randomIntMax(groupPickParam2.length)];
                                        // 랜덤 픽 할때
                                        let randomPlacePick = outGroupRemainderFormList[randomGroupPick][randomIntMax(outGroupRemainderFormList[randomGroupPick].length)];

                                        if (innerShuffleListForm[randomGroupPick][randomPlacePick] == true) {

                                            innerShuffleListForm[randomGroupPick][randomPlacePick] = nowMember;
                                            innerHistoryIndex[randomGroupPick][randomPlacePick] = false;
                                        } else {
                                            var temp1 = innerShuffleListForm[randomGroupPick][randomPlacePick]
                                            innerShuffleListForm[randomGroupPick][randomPlacePick] = nowMember;

                                            nowMember = temp1;
                                        }
                                    }
                                }
                            } else {
                                // 랜덤 픽 할때 있는 애만 골라야 함
                                let randomGroupPick = groupPickParam[randomIntMax(groupPickParam.length)];
                                // 랜덤 픽 할때
                                let randomPlacePick = inOutGroupRemainderFormList[randomGroupPick][randomIntMax(inOutGroupRemainderFormList[randomGroupPick].length)];

                                innerShuffleListForm[randomGroupPick][randomPlacePick] = nowMember;
                                innerHistoryIndex[randomGroupPick][randomPlacePick] = false;
                            }
                            nowCount = innerHistoryTrueCount(innerHistoryIndex);
                        }
                    }
                    listItemHistory(historyParam, innerShuffleListForm);
                    console.log('historyParam', historyParam)
                    shuffleCount++;
                    console.log('shuffleCount', shuffleCount, '번째')
                } else {
                    shuffleCount++;
                    // 3단계
                    for (var lp2 = 0; lp2 < shuffleListParam.length; lp2++) {
                        let nowMember = shuffleListParam[lp2];
                        // 돌면서 외부 히스토리에서 남은 가능한 자리에 넣어주면 됨
                        // historyParam[shuffleListParam[lp2]] 2차원 배열 외부 히스토리
                        for (var lp3 = 0; lp3 < historyParam[nowMember].length; lp3++) {
                            for (var lp4 = 0; lp4 < historyParam[nowMember][lp3].length; lp4++) {
                                if (historyParam[nowMember][lp3][lp4] == true) {
                                    innerShuffleListForm[lp3][lp4] = nowMember;
                                    innerHistoryIndex[lp3][lp4] = false;
                                }
                            }
                        }
                    }
                    listItemHistory(historyParam, innerShuffleListForm);
                    console.log('historyParam', historyParam)
                    console.log('shuffleCount', shuffleCount, '번째')
                    shuffleCount = 1;
                    console.log('shuffleCount', shuffleCount, '초기화')
                }
            }
        }

        nowList = changeFormToList(innerShuffleListForm);
        return nowList;
    };
    // ------------------------셔플 관련 함수-------------------------------


    /* 
        @param renderListFormattingParam 대상 list

        그냥 list 형태로 들어옴
        render
    */
    const renderList = function (renderListFormattingParam) {
        for (var i in renderListFormattingParam) {
            $('li').eq(i).text(renderListFormattingParam[i]);
        }
    }



    /* 
    초기화를 하고 처음 섞어서(shuffle) 기록(itemHistory) 후 renderList
    */
    $("#setSeat").on("click", function () {
        if ($('#inputGroup').val()) {
            inputGroup = $('#inputGroup').val();
        }
        historyObject = groupObjCreate(originList, inputGroup);
        nowList = originList
        var nowRenderList = shuffle(historyObject, nowList, inputGroup);
        renderList(nowRenderList);
    });
    /* 
        섞어서(shuffle) 기록(itemHistory) 후 renderList
    */
    $("#randomSeat").on("click", function () {
        var nowRenderList = shuffle(historyObject, nowList, inputGroup);
        renderList(nowRenderList);
    });
});