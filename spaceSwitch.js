const start = function(){

    const hi = '연결 성공';
    console.log(hi);
    
    const list = ['권시연', '김예은', '김예진', '김재영', '노유림', '민지홍', '박윤재', '이소현', '이재빈', '이지현', '임정환', '정우리'];
    
    $('li').each(list, function(){
        console.log(list);
    });

    for(const listNum in list){

        $('li:eq(listNum)').text(list[listNum]);
        console.log(listNum);
        console.log(list[listNum]);
    }
    
}();