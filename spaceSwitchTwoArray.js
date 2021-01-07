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
    let shuffleCount = 1;

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
        @param outterHistory Form 형식의 list
        @param innerHistory Form 형식의 list

        inner outter 둘 다 true를 반환
    */
    const inOutTrueRemainder = function (outterHistory1, innerHistory1) {
        let inOutTrue11Array = [];
        let inOutTrue21Array = [];

        for (var lp1 = 0; lp1 < outterHistory1.length; lp1++) {
            for (var lp2 = 0; lp2 < outterHistory1[lp1].length; lp2++) {
                if (outterHistory1[lp1][lp2] == true && innerHistory1[lp1][lp2] == true) {
                    inOutTrue21Array.push(lp2);
                }
            }
            inOutTrue11Array.push(inOutTrue21Array);
            inOutTrue21Array = [];
        }

        return inOutTrue11Array;
    };

    /* 
        외부 히스토리 true
        내부 히스토리 true
        현재 그룹 아님

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

    const trueRemainderGroup = function (trueArray) {
        let trueGroupArray = [];

        for (var lp1 = 0; lp1 < trueArray.length; lp1++) {
            if (trueArray[lp1].length !== 0) {
                trueGroupArray.push(lp1);
            }
        }

        return trueGroupArray;
    };

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
                historyParam = groupObjCreate(shuffleListParam, shuffleGroupParam);
                // 랜덤 배정 후 히스토리 기록을 위해 formatting
                innerShuffleList = noLimitRandomList(originList);
                innerShuffleListForm = changeListToForm(innerShuffleList, shuffleGroupParam);
                //shuffleList에 지금 할당된걸 historyObject에 기록해야 함.
                listItemHistory(historyParam, innerShuffleListForm);
                console.log('historyParam', historyParam)

            } else { // true, false 섞여있을때
                /* 
                전제 - 앞 순서에서 자리를 고르면 내부 히스토리가 쌓이고
                앞 순서의 내부 히스토리가 쌓인 상태에서 이전 그룹이 아닌 동시에
                외부 히스토리와 내부 히스토리를 비교하여 할당 가능한 곳에 넣어준다.
                
                여기의 알고리즘 순서   
                1. 일단 이전 그룹이외의 그룹에 들어간다.
                2. 내부 & 외부 히스토리에서 동시에 가능한 곳으로 간다.
                3. 마지막 순서에는 들어갈 곳이 1곳 밖에 남지 않아서 자동으로 들어간다.
                
                
                count1 이 12번째에는 외부 히스토리를 보면 들어갈 수 있는 곳이 다들 1곳 밖에없음
                그래서 횟수를 카운트 해줌.
                일반적으로 사용할 수 있으려면 맴버의 수 만큼 카운트하게 해야함.


                -------
                알고리즘 개선
                - 현재 에러가 발생하는 이유
                현재 그룹을 배제했기 때문

                1. inOutOtherGroup 함수로 돌린다.
                2. inOutOtherGroup == [[],[],[]] 인데 innerHistoryCheck(innerHistory, false) != false가 나와
                false가 나온다는 이유는 모두 false가 아니라는 소리임
                3. A가 들어갈 수 있는 자리에 들어가고(outGroup) 그 자리에 배정되었던
                B를 inOutGroup을 먼저 실행해보고 들어갈 수 없으면
                outGroup으로 배정한다.
                while(!innerHistoryCheck(innerHistory, false)){
                    C를 inOutGroup을 먼저 실행해보고 들어갈 수 없으면
                    outGroup으로 배정한다.
                }

                결과적으로는 innerHistory에 true로 되어있는 곳에 할당이 될 때까지 while을 돌꺼임

                아마 true가 1,2 개 정도? 일듯함
                -------
                */
                //마지막 순서일때 판단.
                if (shuffleCount < nowList.length - 1) {
                    console.log('shuffleCount < nowList.length 진입')
                    // 각 사람별 가능한거 뽑아서 남은 자리에 배정
                    for (var lp1 = 0; lp1 < shuffleListParam.length; lp1++) {
                        let nowMember = shuffleListParam[lp1];
                        // shuffleListParam[lp1] 리스트에서 순서대로 이름 추출
                        // historyParam[shuffleListParam[lp1]] 2차원 배열 외부 히스토리

                        // 1단계 && 2단계
                        // 이전 그룹 X && 내부 히스토리 true && 외부 히스토리 true => 조건 만족해야함.
                        // 바로 직전에 쌓인것 까지 모두 포함하는 히스토리
                        // 위 조건을 만족하면 그것에 중복이 존재 할 수가 없음
                        console.log('--------------시작----------------')
                        let compareCount = innerHistoryTrueCount(innerHistoryIndex);
                        let nowCount;
                        let loopCount = 0;
                        while ((compareCount - 1) != nowCount) {
                            
                            console.log('nowMember', nowMember)
                            let nowGroup = findNowGroup(nowList, nowMember, shuffleGroupParam);
                            console.log('nowGroup', nowGroup)
                            let inOutGroupRemainderFormList = inOutOtherGroupRemainder(historyParam[nowMember], innerHistoryIndex, nowGroup);
                            console.log('inOutGroupRemainderFormList', inOutGroupRemainderFormList)
                            console.log('innerShuffleListForm', innerShuffleListForm)
                            console.log('innerHistoryIndex', innerHistoryIndex)
                            let groupPickParam = trueRemainderGroup(inOutGroupRemainderFormList);
                            console.log('groupPickParam', groupPickParam)
                            if (groupPickParam.length === 0) {
                                console.log('길이 0에 진입')
                                if (innerHistoryCheck(innerHistoryIndex, false) == false) {
                                    console.log('진입점 체크 1')
                                    let outGroupRemainderFormList = outOtherGroupRemainder(historyParam[nowMember], nowGroup);
                                    let groupPickParam2 = trueRemainderGroup(outGroupRemainderFormList);
                                    if (groupPickParam2.length === 0 || loopCount>3) {
                                        console.log('진입점 체크 2')
                                        console.log('길이 0 2페이지에 진입')
                                        if (innerHistoryCheck(innerHistoryIndex, false) == false) {
                                            // 마지막 부분에서는 랜덤을 진행하지 않는다.
                                            // 들어갈 수 있는 자리가 거의 없기 때문에 무한 루프가 된다.
                                            console.log('진입점 체크 3')

                                            // 여기서 inOut으로 되는 애들 리턴해주는 함수 사용해서 해당하는 애들로
                                            // 넣어준 애가 이미 inner 히스토리에 있는 애면 걔를 뺴서 다시 배정
                                            // for문 리스트 돌려서 가능한 애 찾아서
                                            // 지금 inner에 들어가 있는거 빼고 가능한 곳에 넣고
                                            // ?? 그담에?/
                                            let outRemainderFormList = outRemainder(historyParam[nowMember]);
                                            let groupPickParam3 = trueRemainderGroup(outRemainderFormList);
                                            console.log('groupPickParam3', groupPickParam3)
                                            let groupPick = groupPickParam3[randomIntMax(groupPickParam3.length)];
                                            console.log('groupPick', groupPick)
                                            let placePick = outRemainderFormList[groupPick][randomIntMax(outRemainderFormList[groupPick].length)];
                                            console.log('placePick', placePick)
                                            
                                            if (innerShuffleListForm[groupPick][placePick] == true) {
                                                console.log('진입점 체크 4')
                                                
                                                innerShuffleListForm[groupPick][placePick] = nowMember;
                                                console.log('innerShuffleListForm[groupPick][placePick]', innerShuffleListForm[groupPick][placePick])
                                                innerHistoryIndex[groupPick][placePick] = false;
                                                console.log('innerHistoryIndex[groupPick][placePick]', innerHistoryIndex[groupPick][placePick])
                                            } else {
                                                console.log('진입점 체크 5')
                                                var temp = innerShuffleListForm[groupPick][placePick]
                                                innerShuffleListForm[groupPick][placePick] = nowMember;
                                                console.log('innerShuffleListForm[groupPick][placePick]', innerShuffleListForm[groupPick][placePick])
                                                
                                                nowMember = temp;
                                            }
                                        }
                                    } else {
                                        loopCount++;
                                        console.log('진입점 체크 6')
                                        // 랜덤 픽 할때 있는 애만 골라야 함
                                        let randomGroupPick = groupPickParam2[randomIntMax(groupPickParam2.length)];
                                        console.log('groupPickParam2.length', groupPickParam2.length)
                                        console.log('randomGroupPick', randomGroupPick)
                                        // 랜덤 픽 할때
                                        let randomPlacePick = outGroupRemainderFormList[randomGroupPick][randomIntMax(outGroupRemainderFormList[randomGroupPick].length)];
                                        console.log('randomPlacePick', randomPlacePick)

                                        if (innerShuffleListForm[randomGroupPick][randomPlacePick] == true) {
                                            console.log('진입점 체크 7')

                                            innerShuffleListForm[randomGroupPick][randomPlacePick] = nowMember;
                                            console.log('innerShuffleListForm[randomGroupPick][randomPlacePick]', innerShuffleListForm[randomGroupPick][randomPlacePick])
                                            innerHistoryIndex[randomGroupPick][randomPlacePick] = false;
                                            console.log('innerHistoryIndex[randomGroupPick][randomPlacePick]', innerHistoryIndex[randomGroupPick][randomPlacePick])
                                        } else {
                                            console.log('진입점 체크 8')
                                            var temp1 = innerShuffleListForm[randomGroupPick][randomPlacePick]
                                            innerShuffleListForm[randomGroupPick][randomPlacePick] = nowMember;
                                            console.log('innerShuffleListForm[randomGroupPick][randomPlacePick]', innerShuffleListForm[randomGroupPick][randomPlacePick])
                                            
                                            nowMember = temp1;
                                        }
                                    }
                                }
                            } else {
                                console.log('진입점 체크 9')

                                // 랜덤 픽 할때 있는 애만 골라야 함
                                let randomGroupPick = groupPickParam[randomIntMax(groupPickParam.length)];
                                console.log('randomGroupPick', randomGroupPick)
                                // 랜덤 픽 할때
                                let randomPlacePick = inOutGroupRemainderFormList[randomGroupPick][randomIntMax(inOutGroupRemainderFormList[randomGroupPick].length)];
                                console.log('randomPlacePick', randomPlacePick)

                                innerShuffleListForm[randomGroupPick][randomPlacePick] = nowMember;
                                console.log('innerShuffleListForm[randomGroupPick][randomPlacePick]', innerShuffleListForm[randomGroupPick][randomPlacePick])
                                innerHistoryIndex[randomGroupPick][randomPlacePick] = false;
                                console.log('innerHistoryIndex[randomGroupPick][randomPlacePick]', innerHistoryIndex[randomGroupPick][randomPlacePick])
                            }
                            nowCount = innerHistoryTrueCount(innerHistoryIndex);
                        }
                    }
                    listItemHistory(historyParam, innerShuffleListForm);
                    console.log('historyParam', historyParam)
                    shuffleCount++;
                    console.log('shuffleCount', shuffleCount, '번째')
                } else {
                    console.log('else 진입')
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
                    shuffleCount = 1;
                }
            }
        }

        console.log('innerShuffleListForm', innerShuffleListForm)
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
    });
});