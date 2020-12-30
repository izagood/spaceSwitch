/* 

2차원 배열에 false로 할당하고
각 그룹에 flag를 true로 줌
그리고 할당한 그룹에 flag를 false로 줘서
그 자리에 앉았으면 다음 앉을때
해당 그룹의 flag가 false라 들어갈 수 없고
2개 중에 랜덤으로 true인 그룹에 들어가는데
랜덤으로 뽑힌 그룹의 배열이 모두 true이면 다른 그룹에 할당

일반적으로 사용할 수 있는 기능으로 만들자.
*/

$(document).ready(function () {

    const list = ['권시연', '김예은', '김예진', '김재영', '노유림', '민지홍', '박윤재', '이소현', '이재빈', '이지현', '임정환', '정우리'];
    const hi = 'one연결 성공';
    console.log(hi);

    let jsonObj = {};

    const arrayCreate = function (membersList, groups) {
        // value에 넣어줄 배열 생성
        var outArr = [];
        var inArr = [];
        const membersListLength = membersList.length;
        let maxGroupMembers;
        let minGroupMembers;
        const remainderGroupMembers = membersListLength % groups;
        if (membersListLength < groups) {
            var count1 = 0;
            for (var a = 0; a < groups; a++) {
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
                maxGroupMembers = membersListLength / groups;

                for (var i = 0; i < groups; i++) {

                    for (var j = 0; j < maxGroupMembers; j++) {
                        inArr.push(true);
                    }
                    outArr.push(inArr);
                    inArr = []
                }
            }
            // 0으로 떨어지지 않으면 maxGroupMembers + 1 만큼 돌면서 push 하고
            // remainderGroupMembers 만큼 -1하여 push한다. 
            else {
                maxGroupMembers = (membersListLength / groups) + 1;
                minGroupMembers = membersListLength / groups;
                let count = 0;

                for (var k = 0; k < groups; k++) {
                    if (count < remainderGroupMembers) {
                        for (var l = 0; l < maxGroupMembers; l++) {
                            inArr.push(true);
                        }
                        count++;
                    } else {
                        for (var m = 0; m < minGroupMembers; m++) {
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
        
        json 객체로 만들어 지는데 jsonObj에 key = 사람, value = 배열
        
    */
    const groupCreate = function (membersList, groups) {
        // 객체 초기화
        jsonObj = {};
        const array = arrayCreate(membersList, groups);
        // key : value 형태로 객체 생성
        for (var j = 0; j < membersList.length; j++) {
            jsonObj[membersList[j]] = array;
        }
    };

    // 자리 히스토리
    const itemHistory = function (itemHistoryKey, itemHistoryValue) {
        jsonObj.itemHistoryKey.push(itemHistoryValue);
    }

    // render
    const renderList = function (renderListParam) {
        for (var i in renderListParam) {
            $('li').eq(i).text(renderListParam[i]);
            itemHistory(renderListParam[i], i);
        }
    }

    const setList = function () {
        renderList(testList);
    };

    const shuffleList = function () {

    };



    $("#setSeat").on("click", function () {
        groupCreate(list, 3);
        setList();
    });

    $("#randomSeat").on("click", function () {
        shuffleList();
    });
});