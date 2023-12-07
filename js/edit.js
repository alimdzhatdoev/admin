function getData(tableName, id) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: 'admin/includes/CRUD/getDataFromDB.php',
            type: 'POST',
            data: {
                'id': id,
                'tableName': tableName
            },
            dataType: 'json',
            success: function (data) {
                // function compareDates(a, b) {
                //     const dateA = new Date(a.date);
                //     const dateB = new Date(b.date);

                //     // Сравниваем даты
                //     if (dateA > dateB) {
                //         return -1;
                //     } else if (dateA < dateB) {
                //         return 1;
                //     } else {
                //         return 0;
                //     }
                // }

                let dataArray = Object.values(data);

                //resolve(dataArray.sort(compareDates));
                resolve(dataArray);
            },
            error: function (xhr, status, error) {
                console.error('Error:', xhr, status, error);
                reject(error);
            }
        });
    });
}

function stringToImageArray(imageString) {
    return imageString.split(',').map(image => image.trim());
}

//Выгрузка всех новостей в новости
getData("news").then((response) => {
    let block = $("#news_All").empty();
    const maxCharacters = 100;

    response.forEach((element) => {
        block.append(`
            <div class="events_block">
                <div class="events_block__top">
                    <img src="admin/img/${stringToImageArray(element.img)[0]}" alt="" />
                </div>
                <div class="events_block__bottom">
                <div class="events_block__bottom___line">
                    <img src="img/forEvent.png" alt="" />
                </div>
                <div class="events_block__bottom___title">
                    ${element.title.slice(0, maxCharacters)}...
                </div>
                <div class="events_block__bottom___dops">
                    <div class="events_block__bottom___dops____date">${
                      element.date
                    }</div>
                    <a href="new.html?id_new=${
                      element.id
                    }" class="events_block__bottom___dops____readMore">
                        Читать дальше >>
                    </a>
                </div>
                </div>
            </div>
        `);
    });
});

//Редактирование новости
const url_new = new URL(window.location.href);
const queryParams_new = url_new.searchParams;
const id_new = queryParams_new.get("id_new");
if (id_new) {
    getData("news", id_new, "admin").then((response) => {
        $("#news_find_new .new_block__title").text(response[1]);
        $("#newName").text(response[1]);

        for (let i = 0; i < stringToImageArray(response[4]).length; i++) {
            $("#news_find_new .new_block__img").append(`
                <img src="admin/img/${stringToImageArray(response[4])[i]}" alt="" />
            `);
        }

        $("#news_find_new .new_block__text").html(
            response[2]
        );
    });
}

//Выгрузка всех новостей на главную
getData("news").then((response) => {
    let block = $("#news_show_main_page").empty();
    const maxCharacters = 100;

    let value = 6;
    let length = response.length;

    if (value > length) {
        value = length;
    }

    for (let i = 0; i < value; i++) {
        block.append(`
            <div class="events_block">
                <div class="events_block__top">
                    <img src="admin/img/${stringToImageArray(response[i].img)[0]}" alt="" />
                </div>
                <div class="events_block__bottom">
                <div class="events_block__bottom___line">
                    <img src="img/forEvent.png" alt="" />
                </div>
                <div class="events_block__bottom___title">
                    ${response[i].title.slice(0, maxCharacters)}...
                </div>
                <div class="events_block__bottom___dops">
                    <div class="events_block__bottom___dops____date">${
                      response[i].date
                    }</div>
                    <a href="new.html?id_new=${
                      response[i].id
                    }" class="events_block__bottom___dops____readMore">
                        Читать дальше >>
                    </a>
                </div>
                </div>
            </div>
        `);
    }
});

// ---------------------------------------------------------

//выгрузка всех слайдов в слайдер
$(document).ready(function () {
    getData("slider")
        .then((response) => {
            let slides = '';
            response.forEach((element) => {
                slides += `
                    <div class="swiper-slide slider">
                        <div class="slider_left">
                            <img src="admin/img/${stringToImageArray(element.img)[0]}" alt="" />
                        </div>
                        <div class="slider_right">
                            <p class="slider_right__title">
                                ${element.title}
                            </p>
                            <p class="slider_right__desc">
                                ${element.text}
                            </p>
                            <a href="${element.link}" class="slider_right__button">Узнать больше</a>
                        </div>
                    </div>
                `;
            });

            const swiperHtml = `
                <swiper class="mySwiper" pagination="true">
                    <div class="swiper-wrapper">
                        ${slides}
                    </div>
                    <div class="swiper-pagination"></div>
                </swiper>
            `;

            $("#slider_all_show").html(swiperHtml);

            if ($("#slider_all_show").length) {
                const swiper = new Swiper('.mySwiper', {
                    // Опциональные параметры
                    direction: 'horizontal',
                    loop: true,
                    pagination: {
                        el: '.swiper-pagination',
                    },
                    autoplay: {
                        delay: 5000,
                    },
                });
            }
        });
});

// ---------------------------------------------------------

//Выгрузка всех услуг
getData("services").then((response) => {
    let block = $("#service_all").empty();

    function getFileExtension(filename) {
        return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
    }

    response.forEach((element) => {
        fetch(`admin/img/${stringToImageArray(element.img)[0]}`)
            .then(elem => {
                let extension = getFileExtension(element.img[0]);
                if (extension == 'svg') {
                    return elem.text()
                } else {
                    return "img"
                }
            })
            .then(data => {
                let imgData;
                if (data == 'img') {
                    imgData = `<img src='admin/img/${stringToImageArray(element.img)[0]}' />`;
                } else {
                    imgData = data;
                }
                let title = element.title;
                let limitedStr = title.slice(0, 50);
                block.append(`
                    <div class="service_block">
                        <div class="service_block__img1">
                            <img src="img/my-bussiness logo.png" alt="" />
                        </div>
                        <div class="service_block__img2">
                            <img src="img/hoverServiceEllipce.png" alt="" />
                        </div>
                        <div class="service_block__main">
                            <div class="service_block__main___top" >
                                ${imgData}
                            </div>
                            <div class="service_block__main___bottom">
                                <div class="service_block__main___bottom____text">
                                ${limitedStr}...
                                </div>
                                <a href="openService.html?id_service=${element.id}" class="service_block__main___bottom____button">
                                    <svg width="66" height="64" viewBox="0 0 66 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M65 32C65 49.092 50.7023 63 33 63C15.2977 63 1 49.092 1 32C1 14.908 15.2977 1 33 1C50.7023 1 65 14.908 65 32Z"
                                        stroke="#562211" stroke-width="2" />
                                    <path
                                        d="M45.7071 32.7071C46.0976 32.3166 46.0976 31.6834 45.7071 31.2929L39.3431 24.9289C38.9526 24.5384 38.3195 24.5384 37.9289 24.9289C37.5384 25.3195 37.5384 25.9526 37.9289 26.3431L43.5858 32L37.9289 37.6569C37.5384 38.0474 37.5384 38.6805 37.9289 39.0711C38.3195 39.4616 38.9526 39.4616 39.3431 39.0711L45.7071 32.7071ZM20 33L45 33L45 31L20 31L20 33Z"
                                        fill="#562211" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                `)
            })
            .catch(error => {
                console.error('Ошибка при загрузке SVG: ', error);
            });

    });
});

//Редактирование услуги
const url_service = new URL(window.location.href);
const queryParams_service = url_service.searchParams;
const id_service = queryParams_service.get("id_service");
if (id_service) {
    getData("services", id_service).then((response) => {
        $("#services_find_service .new_block__title").text(response[1]);
        $("#newName").text(response[1]);
        $("#services_find_service .new_block__nums").html(
            response[2]
        );
    });
}

//Выгрузка всех услуг на главную
getData("services").then((response) => {
    let block = $("#services_show_main_page").empty();

    let value = 6;
    let length = response.length;

    if (value > length) {
        value = length;
    }

    function getFileExtension(filename) {
        return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
    }

    for (let i = 0; i < value; i++) {
        fetch(`admin/img/${stringToImageArray(response[i].img)[0]}`)
            .then(elem => {
                let extension = getFileExtension(stringToImageArray(response[i].img)[0]);
                if (extension == 'svg') {
                    return elem.text()
                } else {
                    return "img"
                }
            })
            .then(data => {
                let imgData;
                if (data == 'img') {
                    imgData = `<img src='admin/img/${stringToImageArray(response[i].img)[0]}' />`;
                } else {
                    imgData = data;
                }
                let title = response[i].title;
                let limitedStr = title.slice(0, 50);
                block.append(`
                    <div class="service_block">
                        <div class="service_block__img1">
                            <img src="img/my-bussiness logo.png" alt="" />
                        </div>
                        <div class="service_block__img2">
                            <img src="img/hoverServiceEllipce.png" alt="" />
                        </div>
                        <div class="service_block__main">
                            <div class="service_block__main___top" >
                                ${imgData}
                            </div>
                            <div class="service_block__main___bottom">
                                <div class="service_block__main___bottom____text">
                                ${limitedStr}...
                                </div>
                                <a href="openService.html?id_service=${response[i].id}" class="service_block__main___bottom____button">
                                    <svg width="66" height="64" viewBox="0 0 66 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M65 32C65 49.092 50.7023 63 33 63C15.2977 63 1 49.092 1 32C1 14.908 15.2977 1 33 1C50.7023 1 65 14.908 65 32Z"
                                        stroke="#562211" stroke-width="2" />
                                    <path
                                        d="M45.7071 32.7071C46.0976 32.3166 46.0976 31.6834 45.7071 31.2929L39.3431 24.9289C38.9526 24.5384 38.3195 24.5384 37.9289 24.9289C37.5384 25.3195 37.5384 25.9526 37.9289 26.3431L43.5858 32L37.9289 37.6569C37.5384 38.0474 37.5384 38.6805 37.9289 39.0711C38.3195 39.4616 38.9526 39.4616 39.3431 39.0711L45.7071 32.7071ZM20 33L45 33L45 31L20 31L20 33Z"
                                        fill="#562211" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                `)
            })
            .catch(error => {
                console.error('Ошибка при загрузке SVG: ', error);
            });

    };
});


//Для услуг выгрузка в разные страницы

async function getServicesNeedTags(tagName, idBlock) {
    try {
        function getFileExtension(filename) {
            return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
        }
        const response = await getData("services");
        let block = $(`#${idBlock}`).empty();
        response.forEach((element) => {
            let tags = element.tags_centers.toLowerCase();
            if (tags.includes(tagName.toLowerCase())) {
                fetch(`admin/img/${stringToImageArray(element.img)[0]}`)
                .then(elem => {
                    let extension = getFileExtension(element.img[0]);
                    if (extension == 'svg') {
                        return elem.text()
                    } else {
                        return "img"
                    }
                })
                .then(data => {
                    let imgData;
                    if (data == 'img') {
                        imgData = `<img src='admin/img/${stringToImageArray(element.img)[0]}' />`;
                    } else {
                        imgData = data;
                    }
                    let title = element.title;
                    let limitedStr = title.slice(0, 50);
                    block.append(`
                        <div class="service_block">
                            <div class="service_block__img1">
                                <img src="img/my-bussiness logo.png" alt="" />
                            </div>
                            <div class="service_block__img2">
                                <img src="img/hoverServiceEllipce.png" alt="" />
                            </div>
                            <div class="service_block__main">
                                <div class="service_block__main___top" >
                                    ${imgData}
                                </div>
                                <div class="service_block__main___bottom">
                                    <div class="service_block__main___bottom____text">
                                    ${limitedStr}...
                                    </div>
                                    <a href="openService.html?id_service=${element.id}" class="service_block__main___bottom____button">
                                        <svg width="66" height="64" viewBox="0 0 66 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M65 32C65 49.092 50.7023 63 33 63C15.2977 63 1 49.092 1 32C1 14.908 15.2977 1 33 1C50.7023 1 65 14.908 65 32Z"
                                            stroke="#562211" stroke-width="2" />
                                        <path
                                            d="M45.7071 32.7071C46.0976 32.3166 46.0976 31.6834 45.7071 31.2929L39.3431 24.9289C38.9526 24.5384 38.3195 24.5384 37.9289 24.9289C37.5384 25.3195 37.5384 25.9526 37.9289 26.3431L43.5858 32L37.9289 37.6569C37.5384 38.0474 37.5384 38.6805 37.9289 39.0711C38.3195 39.4616 38.9526 39.4616 39.3431 39.0711L45.7071 32.7071ZM20 33L45 33L45 31L20 31L20 33Z"
                                            fill="#562211" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    `)
                })
                .catch(error => {
                    console.error('Ошибка при загрузке SVG: ', error);
                });
            }
        });
        return (block);
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

(async () => {
    try {
        const result = await getServicesNeedTags('цпп', 'services_show_cpp');
    } catch (error) {
        console.error("Error:", error);
    }
})();

(async () => {
    try {
        const result = await getServicesNeedTags('цпэ', 'services_show_cpe');
    } catch (error) {
        console.error("Error:", error);
    }
})();

(async () => {
    try {
        const result = await getServicesNeedTags('цк', 'services_show_ck');
    } catch (error) {
        console.error("Error:", error);
    }
})();

(async () => {
    try {
        const result = await getServicesNeedTags('цисс', 'services_show_ciss');
    } catch (error) {
        console.error("Error:", error);
    }
})();

(async () => {
    try {
        const result = await getServicesNeedTags('цмит', 'services_show_cmit');
    } catch (error) {
        console.error("Error:", error);
    }
})();



// ---------------------------------------------------------

//Выгрузка баннера на главную
$(document).ready(function () {
    getData("banners")
        .then((response) => {
            let slides = '';
            response.forEach((element) => {
                slides += `
                    <div class="swiper-slide slider">
                        <a href="${element.link}" target="_blank">
                            <img src="admin/img/${element.img}" alt="" />
                        </a>
                    </div>
                `;
            });

            const swiperHtml = `
                <swiper class="mySwiper mainBanner">
                    <div class="swiper-wrapper">
                        ${slides}
                    </div>
                </swiper>
            `;

            $("#main_banner").html(swiperHtml);

            if ($("#slider_all_show").length) {
                const swiper = new Swiper('.mainBanner', {
                    // Опциональные параметры
                    direction: 'horizontal',
                    loop: true,
                    autoplay: {
                        delay: 5000,
                    },
                });
            }
        });
});

// ---------------------------------------------------------

//Выгрузка всех видеоблоков в видеоблоки
getData("videoblog").then((response) => {
    let block = $("#video_All").empty();

    response.forEach((element) => {
        block.append(`
            <div class="video_videos__block">
                <div class="video_videos__block___img">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="${element.link}" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; 
                        autoplay; 
                        clipboard-write; 
                        encrypted-media; 
                        gyroscope; 
                        picture-in-picture; 
                        web-share" 
                        allowfullscreen
                    >
                    </iframe>
                </div>
                <div class="video_videos__block___date">${element.date}</div>
                <div class="video_videos__block___text">
                    ${element.title}
                </div>
            </div>
        `);
    });
});

//Выгрузка всех видеоблоков на главную
getData("videoblog").then((response) => {
    let block = $("#show_videos_main").empty();

    let value = 6;
    let length = response.length;

    if (value > length) {
        value = length;
    }

    for (let i = 0; i < value; i++) {
        block.append(`
            <div class="video_videos__block">
                <div class="video_videos__block___img">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="${response[i].link}" 
                        allowfullscreen
                    >
                    </iframe>
                </div>
                <div class="video_videos__block___date">${response[i].date}</div>
                <div class="video_videos__block___text">
                    ${response[i].title}
                </div>
            </div>
        `);
    }
});

// ---------------------------------------------------------

//Выгрузка всех районов на главную
getData("map").then((response) => {
    let all_IP = 0;
    let all_UL = 0;
    let all_SMSP = 0;

    let all_IP_not_city = 0;
    let all_UL_not_city = 0;
    let all_SMSP_not_city = 0;

    let all_samozanyatiy = 0;

    if ($("#moveBlockMain").length) {
        response.forEach((element) => {
            if (element.title != 'Самозанятые') {
                all_IP += +element.block_1;
                all_UL += +element.block_2;
                all_SMSP += +element.block_3;
                showBlockInfoAndColor(element.title, element);
            }
            if (element.title != 'г. Черкесск' && element.title != 'Самозанятые') {
                all_IP_not_city += +element.block_1;
                all_UL_not_city += +element.block_2;
                all_SMSP_not_city += +element.block_3;
            }
            if (element.title == 'Самозанятые') {
                all_samozanyatiy += +element.block_3;
            }

        });

        $('#all_IP').text(all_IP);
        $('#all_UL').text(all_UL);
        $('#all_SMSP').text(all_SMSP);
        $('#all_IP_not_city').text(all_IP_not_city);
        $('#all_UL_not_city').text(all_UL_not_city);
        $('#all_SMSP_not_city').text(all_SMSP_not_city);
        $('#all_samozanyatiy').text(all_samozanyatiy);
    }
});

function showBlockInfoAndColor(idBlock, data) {
    let draggable = document.getElementById(idBlock);
    let moveBlockMain = document.getElementById('moveBlockMain');
    let openBlock = document.getElementById('openBlock');


    draggable.onmousemove = function (event) {
        let mouseX = event.clientX - moveBlockMain.getBoundingClientRect().left - 210;
        let mouseY = event.clientY - moveBlockMain.getBoundingClientRect().top - 165;

        $(".fil0").removeClass('showColorBlock');
        $(this).addClass('showColorBlock');

        $(".info_block__showMouse___data____data___title").text($(this).attr('data_name'))

        $(".ip_block").text(data.block_1)
        $(".ul_block").text(data.block_2)
        $(".smsp_block").text(data.block_3)

        $(".info_block__showMouse").show()
        $(".info_block__showMouse").css({
            "left": mouseX + "px",
            "top": mouseY + "px",
            "z-index": "9999"
        })
    };

    openBlock.onmouseenter = function (event) {
        $(".info_block__showMouse").show();
    };

    draggable.onmouseleave = function () {
        $(".info_block__showMouse").hide()
        $(".fil0").removeClass('showColorBlock');
    }
}

// ---------------------------------------------------------

//Выгрузка всех мер поддержки 

//<div class="support_all__blocks___item____text_____date">
//    ${element.date}
//</div>
//<div class="support_all__blocks___item____text_____desc">
//    ${element.subtitle}
//</div>

function showSupports(tag, blockName, response) {
    let block = $(`.${blockName}`).empty();

    response.forEach((element) => {
        if (element.tags == tag) {
            let title = element.title;
            let limitedStr = title;
            
            if (title.length >= 60) {
                limitedStr = title.slice(0, 60) + '...';
            }
            
            block.append(`
                <div class="support_all__blocks___item">
                    <div class="support_all__blocks___item____img">
                        <img src="admin/img/${stringToImageArray(element.img)[0]}" alt="" />
                    </div>
                    <div class="support_all__blocks___item____text">
                        <div class="support_all__blocks___item____text_____title">
                            ${limitedStr}
                        </div>
                        <a href="openSupport.html?id_support=${element.id}" class="support_all__blocks___item____text_____button">
                            Узнать больше
                        </a>
                    </div>
                </div>
            `);
        }
    });
}

function showPopularSupports(tag, blockName, response) {
    let block = $(`.${blockName}`).empty();

    response.forEach((element) => {
        if (element.tags == tag && element.popular == 'Да') {
            block.append(`
                <div class="support_popular__blocks___item">
                    <div class="support_popular__blocks___item____img">
                        <img src="admin/img/${stringToImageArray(element.img)[0]}" alt="" />
                    </div>
                    <div class="support_popular__blocks___item____tag">Популярно</div>
                    <div class="support_popular__blocks___item____elems">
                    <div class="support_popular__blocks___item____elems_____text">
                        ${element.title}
                    </div>
                    <a href="openSupport.html?id_support=${element.id}" class="support_popular__blocks___item____elems_____button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="66"
                            height="64"
                            viewBox="0 0 66 64"
                            fill="none"
                        >
                        <path
                            d="M65 32C65 49.092 50.7023 63 33 63C15.2977 63 1 49.092 1 32C1 14.908 15.2977 1 33 1C50.7023 1 65 14.908 65 32Z"
                            stroke="#8692C3"
                            stroke-width="2"
                        />
                        <path
                            d="M45.7071 32.7071C46.0976 32.3166 46.0976 31.6834 45.7071 31.2929L39.3431 24.9289C38.9526 24.5384 38.3195 24.5384 37.9289 24.9289C37.5384 25.3195 37.5384 25.9526 37.9289 26.3431L43.5858 32L37.9289 37.6569C37.5384 38.0474 37.5384 38.6805 37.9289 39.0711C38.3195 39.4616 38.9526 39.4616 39.3431 39.0711L45.7071 32.7071ZM20 33L45 33L45 31L20 31L20 33Z"
                            fill="#8692C3"
                        />
                        </svg>
                    </a>
                    </div>
                </div>
            `);
        }
    });
}

getData("supports").then((response) => {
    showSupports('Федеральная мера поддержки', 'support_all__blocks', response);
    showPopularSupports('Федеральная мера поддержки', 'support_popular__blocks', response);

    $(".regButton").click(function () {
        showSupports('Региональная мера поддержки', 'support_all__blocks', response);
        showPopularSupports('Региональная мера поддержки', 'support_popular__blocks', response);

        $(".support_popular__title").text('Самые популярные региональные меры поддержки');

        let screenWidth = window.innerWidth;
        if (screenWidth <= 425) {
            $(".activeButton").css("transform", "translate(146px)");
        } else {
            $(".activeButton").css("transform", "translate(243px)");
        }

        $(".activeButton").css("background", "linear-gradient(67deg, #B967C9 2.17%, rgba(0, 0, 0, 0.00) 114.97%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #402C9B");

        $(".support_top__right___gerbs img").eq(0).css("opacity", "0.3");
        $(".support_top__right___gerbs img").eq(1).css("opacity", "1");

        setTimeout(() => {
            $(".regButton").css("color", "#fff");
            $(".fedButton").css("color", "#000");
        }, "100");

        $(".support_top").css("background", "linear-gradient(67deg, #B967C9 2.17%, rgba(0, 0, 0, 0.00) 114.97%), #402C9B");

        $(".support_top__left img").eq(0).attr("src", "img/mainImgSupport2_circle1.png")
        $(".support_top__left img").eq(1).attr("src", "img/mainImgSupport2_circle2.png")
        $(".rightCircle").attr("src", "img/mainImgSupport2_circle3.png")

        $(".support_popular__blocks___item____tag").css("background", "#C88DC5")
        $(".support_all__blocks___item____text_____date").css("color", "#733897")
        $(".support_all__blocks___item____text_____button").css("background", "#733897")
    })

    $(".fedButton").click(function () {
        showSupports('Федеральная мера поддержки', 'support_all__blocks', response);
        showPopularSupports('Федеральная мера поддержки', 'support_popular__blocks', response);

        $(".support_popular__title").text('Самые популярные федеральные меры поддержки');

        let screenWidth = window.innerWidth;
        if (screenWidth <= 425) {
            $(".activeButton").css("transform", "translate(146px)");
        } else {
            $(".activeButton").css("transform", "translate(243px)");
        }

        $(".activeButton").css("transform", "translate(0px)");
        $(".activeButton").css("background", "linear-gradient(249deg, #32AEDB -28.54%, rgba(0, 0, 0, 0.00) 93.07%), #402C9B");

        $(".support_top__right___gerbs img").eq(0).css("opacity", "1");
        $(".support_top__right___gerbs img").eq(1).css("opacity", "0.3");
        setTimeout(() => {
            $(".fedButton").css("color", "#fff");
            $(".regButton").css("color", "#000");
        }, "100");

        $(".support_top").css("background", "linear-gradient(73deg, #2E78E7 2.36%, rgba(0, 0, 0, 0.00) 103.33%), #402C9B");

        $(".support_top__left img").eq(0).attr("src", "img/mainImgSupport1_circle1.png")
        $(".support_top__left img").eq(1).attr("src", "img/mainImgSupport1_circle2.png")
        $(".rightCircle").attr("src", "img/mainImgSupport1_circle3.png")

        $(".support_popular__blocks___item____tag").css("background", "#8692C3")
        $(".support_all__blocks___item____text_____date").css("color", "#3D2A92")
        $(".support_all__blocks___item____text_____button").css("background", "#3D2A92")
    })
});

//Редактирование меры поддержки
const url_supports = new URL(window.location.href);
const queryParams_supports = url_service.searchParams;
const id_support = queryParams_service.get("id_support");
if (id_support) {
    getData("supports", id_support).then((response) => {
        $("#supports_find_support .new_block__title").text(response[1]);
        $("#supports_find_support #supportName").text(response[1]);
        // $("#supports_find_support .new_block__desc").text(response[2]);
        $("#supports_find_support .new_block__textDesc").html(response[2]);

        for (let i = 0; i < stringToImageArray(response[6]).length; i++) {
            $("#supports_find_support .new_block__img").append(`
                <img src="admin/img/${stringToImageArray(response[6])[i]}" alt="" />
            `);
        }

    });
}

// ---------------------------------------------------------

//Выгрузка базы знаний в базу знаний
getData("knowledgeBase").then((response) => {
    let block = $("#KB_All").empty();
    const maxCharacters = 100;

    response.forEach((element) => {
        block.append(`
            <div class="events_block">
                <div class="events_block__top">
                    <img src="admin/img/${stringToImageArray(element.img)[0]}" alt="" />
                </div>
                <div class="events_block__bottom">
                <div class="events_block__bottom___line">
                    <img src="img/forEvent.png" alt="" />
                </div>
                <div class="events_block__bottom___title">
                    ${element.title.slice(0, maxCharacters)}...
                </div>
                <div class="events_block__bottom___dops">
                    <div class="events_block__bottom___dops____date">${
                      element.date
                    }</div>
                    <a href="show_base.html?id_KB=${
                      element.id
                    }" class="events_block__bottom___dops____readMore">
                        Читать дальше >>
                    </a>
                </div>
                </div>
            </div>
        `);
    });
});

//Редактирование базы знаний
const url_KB = new URL(window.location.href);
const queryParams_KB = url_KB.searchParams;
const id_KB = queryParams_new.get("id_KB");
if (id_KB) {
    getData("knowledgeBase", id_KB, "admin").then((response) => {
        $("#KBs_find_KB .new_block__title").text(response[1]);
        $("#KBs_find_KB #newName").text(response[1]);

        for (let i = 0; i < stringToImageArray(response[4]).length; i++) {
            $("#KBs_find_KB .new_block__img").append(`
                <img src="admin/img/${stringToImageArray(response[4])[i]}" alt="" />
            `);
        }

        $("#KBs_find_KB .new_block__text").html(
            response[2]
        );
    });
}

// ---------------------------------------------------------

//Выгрузка витрины в витрины
getData("vitrina").then((response) => {
    let block = $("#vitrina_All").empty();
    const maxCharacters = 100;

    response.forEach((element) => {
        block.append(`
            <a href="openShowcases.html?id_vitrina=${element.id}" class="showcase_services__block">
                <div class="showcase_services__block___imgs">
                    <img src="admin/img/${stringToImageArray(element.img)[0]}" alt="">
                </div>

                <div class="showcase_services__block___bottom">
                    <div class="showcase_services__block___bottom____right">
                        <div class="showcase_services__block___bottom____right_____title">
                        ${element.title}
                        </div>
                        <div class="showcase_services__block___bottom____right_____place">
                        ${element.person_city}
                        </div>
                    </div>
                </div>
            </a>
        `);
    });
});

//Редактирование витрины
const url_vitrina = new URL(window.location.href);
const queryParams_vitrina = url_vitrina.searchParams;
const id_vitrina = queryParams_new.get("id_vitrina");
if (id_vitrina) {
    getData("vitrina", id_vitrina).then((response) => {

        $("#vitrina_find_item .showcase_mainInfo__left___img").html(`
            <img src="admin/img/${stringToImageArray(response[7])[0]}" alt="" />
        `);
        $("#vitrina_find_item .showcase_mainInfo__right___title").text(response[1]);
        $("#vitrina_find_item .showcase_mainInfo__left___bottom____name").text(response[2]);
        $("#vitrina_find_item .showcase_mainInfo__right___place").text(response[5]);
        $(".vitrina #newName").text(response[1]);

        $("#vitrina_find_item .showcase_mainInfo__left___bottom____phone").html(`
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
                <path
                d="M15.9348 18C6.86999 18.0136 -0.00968747 10.6419 1.02398e-05 1.12782C1.02398e-05 0.506503 0.475708 0 1.06251 0H3.86683C4.39337 0 4.84068 0.409646 4.918 0.96112C5.10331 2.28285 5.46675 3.56959 5.99727 4.78204L6.10645 5.03157C6.25826 5.37852 6.15536 5.79076 5.86147 6.01298C4.99301 6.66966 4.66111 7.9915 5.33768 9.0229C6.1867 10.3172 7.25693 11.4501 8.47904 12.3487C9.45309 13.0649 10.7013 12.7135 11.3215 11.7941C11.5315 11.4828 11.921 11.3737 12.2489 11.5346L12.4835 11.6496C13.6287 12.2113 14.844 12.5961 16.0924 12.7923C16.6133 12.8742 17 13.3478 17 13.9053V16.875C17 17.4963 16.5231 18 15.9363 18L15.9348 18Z"
                fill="#787878" />
            </svg>
            ${response[3]}
        `);
        $("#vitrina_find_item .showcase_mainInfo__left___bottom____email").html(`
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="17" viewBox="0 0 22 17" fill="none">
                <path
                d="M19.8 17H2.2C0.984973 17 0 16.0486 0 14.875V2.03256C0.0512692 0.895208 1.02139 -0.00107565 2.2 9.68906e-07H19.8C21.015 9.68906e-07 22 0.951397 22 2.125V14.875C22 16.0486 21.015 17 19.8 17ZM2.2 4.10975V14.875H19.8V4.10975L11 9.775L2.2 4.10975ZM3.08 2.125L11 7.225L18.92 2.125H3.08Z"
                fill="#787878" />
            </svg>
            ${response[4]}
        `);

        for (let i = 1; i < stringToImageArray(response[7]).length; i++) {
            $("#vitrina_find_item .showcase_mainInfo__right___photos").append(`
                <div class="showcase_mainInfo__right___photos___img">
                    <img src="admin/img/${stringToImageArray(response[7])[i]}" alt="" />
                </div>
            `);
        }

        $("#vitrina_find_item .showcase_mainInfo__right___text").html(
            response[6]
        );
    });
}


