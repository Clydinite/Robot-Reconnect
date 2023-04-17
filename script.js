"use strict";

const sidebar = document.getElementById('sidebar')
const cardCount = document.getElementById('card-count')
const response = document.getElementById('response').querySelector('p')

const subject = document.getElementById('subject')
const verb = document.getElementById('verb')
const object = document.getElementById('object')

const subjectSlot = document.getElementById('subject').querySelector('.slot')
const verbSlot = document.getElementById('verb').querySelector('.slot')
const objectSlot = document.getElementById('object').querySelector('.slot')

const unlock = document.getElementById('unlock')
const unlockDisplay = document.getElementById('unlock-display')
const aButton = document.getElementById('a')
const bButton = document.getElementById('b')
const cButton = document.getElementById('c')
const equalButton = document.getElementById('=')
const plusButton = document.getElementById('+')
const minusButton = document.getElementById('-')
const confirmButton = document.getElementById('confirm')
const deleteButton = document.getElementById('delete')
const resetButton = document.getElementById('reset')

/*
第壹獄字卡總整理

名詞 (16)：
我、教室、電腦、資料夾、瀏覽器、電線、門、紀錄、機房、路由器、主機、紅字、角落、甲、乙、丙

動詞 (4)：
移動到、檢視、開啟、接上
*/

const verbs = ['移動到', '檢視', '開啟', '接上']
const nouns = ['我', '教室', '電腦', '資料夾', '瀏覽器', '電線', '門', '紀錄', '機房', '路由器', '主機', '紅字', '角落', '甲', '乙', '丙']

// game-related variables
var location = '教室'
var internet = false
var serverOn = false
var unlockedABC = false // 甲乙丙
var gameEnd = false
var a = 1_000 // hope this doesn't break
var b = 1_000_000
var c = 1
var input = ''

for (let button of [aButton, bButton, cButton, equalButton, plusButton, minusButton]) {
    button.addEventListener('click', () => {
        let row = unlockDisplay.getElementsByClassName('row')
        row[row.length - 1].appendChild(button.cloneNode(true))
    })
}

confirmButton.addEventListener('click', () => {
    input = ''
    let row = unlockDisplay.getElementsByClassName('row')
    let lastRow = row[row.length - 1]
    for (let child of lastRow.children) {
        let text = child.firstElementChild.innerText
        if (text == '甲') {
            text = 'a'
        } else if (text == '乙') {
            text = 'b'
        } else if (text == '丙') {
            text = 'c'
        }
        input += text
    }
    try {
        eval(input)
        if (a == 1 && b == 1_000 && c == 1_000_000) {
            gameEnd = true
            unlock.style.display = 'none'
            typewriter("三個環境變數的值皆已儲存到正確的位置。剎那間，電力因為過載而使教室暫時失去了電力。同時教室與外界連通的門也因為電子鎖失去電力而被開啟。")
        }
        console.log(a, b, c)
    } catch (e) {
        console.log(e)
    } finally {
        let row = document.createElement('div')
        row.className = 'row'
        unlockDisplay.appendChild(row)
    }
})

deleteButton.addEventListener('click', () => {
    let row = unlockDisplay.getElementsByClassName('row')
    let lastRow = row[row.length - 1]
    lastRow.removeChild(lastRow.lastElementChild)
})

resetButton.addEventListener('click', () => {
    unlockDisplay.innerHTML = ''
    a = 1_000
    b = 1
    c = 1_000_000
    input = ''
})


// the cards in sidebar
const sidebarCards = []

// all the cards that the player unlocked
const playerCards = []

// user is able to put the cards in
let clickEventEnabled = true

// player starts with these cards
createCardElements(['我', '移動到', '教室', '電腦'])


function createCardElements(cardArray) {
    for (const playerCard of cardArray) {
        if (playerCards.includes(playerCard)) {
            continue
        }

        playerCards.push(playerCard)
        const card = document.createElement('div')
        const text = document.createElement('p')
        text.innerText = playerCard
        card.appendChild(text)
        card.classList.add('card')

        if (nouns.includes(playerCard)) {
            card.classList.add('noun')
        } else {
            card.classList.add('verb')
        }

        card.addEventListener('click', () => {
            if (!clickEventEnabled) { return; }
            if (Array.from(sidebar.children).includes(card)) {

                // move in
                if (nouns.includes(playerCard)) {
                    if (subjectSlot.children.length == 0) {
                        sidebar.removeChild(card)
                        subjectSlot.appendChild(card)

                    } else if (objectSlot.children.length == 0) {
                        sidebar.removeChild(card)
                        objectSlot.appendChild(card)
                    }
                } else { // verbs.includes(playerCard)
                    if (verbSlot.children.length == 0) {
                        sidebar.removeChild(card)
                        verbSlot.appendChild(card)
                    }
                }
                // the code is triggered when all slots are filled
                if (subjectSlot.children.length && verbSlot.children.length && objectSlot.children.length) {
                    const subjectText = subjectSlot.querySelector('p').innerText
                    const verbText = verbSlot.querySelector('p').innerText
                    const objectText = objectSlot.querySelector('p').innerText

                    switch (`${subjectText} ${verbText} ${objectText}`) {

                        case ("我 移動到 教室"):
                            if (location != "機房") {
                                typewriter("我本來就被困在這間教室......。")
                            } else {
                                locationChange("教室")
                            }
                            break

                        case ("電腦 移動到 教室"):
                            typewriter("電腦本來就在這間教室裡......但是為什麼這臺電腦是開啟的？")
                            break

                        case ("我 移動到 電腦"):
                            locationChange("電腦", "我「檢視」這臺電腦，電腦的主機已爬滿了藤蔓，金屬的部分也早已生鏽，沒想到還可以持續運作。我發現螢幕上有一個奇怪的紅色「資料夾」。正常來說資料夾不應該是黃色的嗎？螢幕上還有一個「瀏覽器」的捷徑，不知道會不會有網路？")
                            createCardElements(['檢視', '資料夾', '瀏覽器'])
                            break

                        case ("我 檢視 電腦"):
                            if (location == "電腦") {
                                typewriter("電腦的主機已爬滿了藤蔓，金屬的部分也早已生鏽。螢幕上有一個紅色資料夾及瀏覽器，就是這樣。")
                            }
                            else {
                                wrongLocation("電腦")
                            }
                            break
                        case ("我 檢視 教室"):
                            if (location != "機房") {
                                typewriter("我觀察四周，眾多的電腦中只有剛剛我檢視的這臺是亮著的。除此之外，我發現了一些「電線」在地上以及看似是通往外面的「門」。")
                                createCardElements(['電線', '門'])
                            }
                            else {
                                wrongLocation("教室")
                            }
                            break

                        case ("教室 檢視 我"):
                            if (location != "機房") {
                                typewriter("我感覺到電腦教室的眾多電腦正盯著我看，彷彿他們具有生命一般……。")
                            }
                            else {
                                wrongLocation("教室")
                            }
                            break

                        case ("電腦 檢視 我"):
                            if (location == "電腦") {
                                if (serverOn) {
                                    typewriter("我要電腦檢視我……。「嗶—嗶—嗶嗶—」電腦：「你……你是？」")
                                } else {

                                    typewriter("我要電腦檢視我，電腦並沒有回應……。")
                                }
                            }
                            else {
                                wrongLocation("電腦")
                            }
                            break

                        case ("我 檢視 電線"):
                            typewriter("在教室地上找到的幾條電線。這些電線已經破舊不堪，表面裹著一層鬆垮的、已經斷裂的橙色絕緣材料，讓裡面的電線暴露在外。有些部分的銅絲也已經裸露出來。")
                            break

                        case ("我 移動到 門"):
                            if (gameEnd) {
                                typewriter("我移動到門前，門的電子鎖已經失效，我跑了出去……。")
                            } else {
                                locationChange("門", "我移動到了門邊。門的附近有許多積水，看起來年久失修……。")
                            }
                            break

                        case ("我 檢視 門"):
                            if (location == "門") {
                                typewriter("一道金屬製厚重的鐵門，上面裝上了電子鎖。")
                            }
                            else {
                                wrongLocation("門")
                            }
                            break

                        case ("我 檢視 瀏覽器"):
                            if (location == "電腦") {
                                typewriter("這個瀏覽器看起來與我熟悉的不太一樣，這讓我感到有些困惑。當我試著「開啟」這個瀏覽器時，它顯示沒有網路的錯誤訊息，也不意外，這個地方看似荒廢許久了。")
                                createCardElements(['開啟'])
                            }
                            else {
                                wrongLocation("電腦")
                            }
                            break

                        case ("我 開啟 門"):
                            if (location == "門") {
                                typewriter("我試著開啟門，但上面裝上了電子鎖，無法開啟……。")
                            }
                            else {
                                wrongLocation("門")
                            }
                            break

                        case ("我 開啟 電腦"):
                            if (location == "電腦") {
                                typewriter("電腦一直都是開啟的狀態。到底這個看似荒廢已久的地方是如何持續供給電源的？")
                            }
                            else {
                                wrongLocation("電腦")
                            }
                            break

                        case ("我 檢視 資料夾"):
                            if (location == "電腦") {
                                typewriter("一個詭異的紅色資料夾。好奇怪，上面居然沒有名稱，這是如何做到的？")
                            }
                            else {
                                wrongLocation("電腦")
                            }
                            break

                        case ("我 開啟 資料夾"):
                            if (location == "電腦") {
                                typewriter("資料夾內有一個文字檔，上面寫著一些文字：\n最近我從上一屆的幹部拿到了他們去年的會議「紀錄」，這正好是我想尋找的東西。我一直覺得社長有點怪異。每次話題只要提到「機房」就避而不談，彷彿內部有著什麼秘密般。機房不是只有教職人員才能夠進入嗎？檔案的最下方還有一個附件，上面寫著「第19屆資訊研究社會議紀錄」。")
                                createCardElements(['紀錄', '機房'])

                            }
                            else {
                                wrongLocation("電腦")
                            }
                            break

                        case ("我 檢視 紀錄"):
                            if (location == "電腦") {
                                typewriter("我檢視了會議紀錄，看到了裡面的內容：\n10/05 第二次開會\n遇到的問題：未來的社課走向尚未確定。\n待辦事項：社服製作、處理機房的網頁架設問題、與他校籌辦迎新。\n\n10/19 第三次開會\n遇到的問題：社團參與度極低。\n待辦事項：向其他社團的社長詢問。\n\n咦，機房？這不是剛才檔案所寫的地方嗎？")
                            } else if (location == "機房") {
                                typewriter("我仔細檢視了機房內的會議紀錄，發現紀錄的具體細節幾乎都被紅筆劃掉了、許多文件也因為潮濕而無法辨識，只剩下一些零碎的線索，似乎是關於人工智慧的計畫。")
                            }
                            else {
                                wrongLocation("電腦")
                            }
                            break

                        case ("我 移動到 機房"):
                            typewriter("機房的門沒有上鎖，我開啟門並進入了機房。我看到了「路由器」與「主機」，地上還有散落著一地的會議紀錄。")
                            createCardElements(['路由器', '主機'])
                            location = "機房"
                            break

                        case ("我 檢視 路由器"):
                            if (location == "機房") {
                                if (internet) {
                                    typewriter("路由器的指示燈穩定的閃爍著。到底這個地方是如何持續運作的……。")
                                } else {
                                    typewriter("路由器的電線看似已經斷掉了，不知道要如何修補。")
                                }

                            }
                            else {
                                wrongLocation("機房")
                            }
                            break

                        case ("我 開啟 路由器"):
                            if (location == "機房") {
                                if (internet) {
                                    typewriter("路由器一直都是開啟的狀態，只是剛才電線被扯下沒有辦法正常運作。")
                                } else {
                                    typewriter("無法開啟路由器，電線已經斷掉了，沒有電源供給。")
                                }

                            }
                            else {
                                wrongLocation("機房")
                            }
                            break

                        case ("我 檢視 主機"):
                            if (location == "機房") {
                                typewriter("我檢視這臺主機的型號。就我所知，它在市面上已經停產了許久了。")
                            }
                            else {
                                wrongLocation("機房")
                            }
                            break

                        case ("我 開啟 主機"):
                            if (location == "機房") {
                                if (serverOn) {
                                    typewriter("主機發出了嗶嗶聲，似乎是開啟了。")
                                }
                                else {
                                    typewriter("無法開啟主機，主機的電線已被損毀，無法接上電源。")
                                }
                            }
                            else {
                                wrongLocation("機房")
                            }
                            break

                        case ("我 檢視 機房"):
                            if (location == "機房") {
                                typewriter("我仔細查看了機房，就只有路由器、主機、散落著一地的會議紀錄和……咦？牆壁角落被刻上了令人不安的「紅字」。是誰做這件事的？")
                                createCardElements(['紅字'])
                            }
                            else {
                                wrongLocation("機房")
                            }
                            break

                        case ("我 檢視 紅字"):
                            if (location == "機房") {
                                typewriter("我檢視牆壁「角落」發現的的紅字，上面寫著：\n我知道他們早晚會來這裡尋找證據，但我已經將電線扯斷，讓他們無法「接上」。你一定會比他們更早來到教室並拿走電腦上的重要資訊，請記得這些東西不能留在這裡。離開時也別忘了將這些字抹除。")
                                createCardElements(['角落', '接上'])
                            }
                            else {
                                wrongLocation("機房")
                            }
                            break

                        case ("電線 接上 路由器"):
                            if (location == "機房") {
                                typewriter("我將電線接上了路由器，路由器的指示燈開始閃爍，這樣好像就有網路了？")
                                internet = true
                            }
                            else {
                                wrongLocation("機房")
                            }
                            break

                        case ("電線 接上 主機"):
                            if (location == "機房") {
                                typewriter("我將電線接上了主機，主機依然沒有反應，這真的還能使用嗎？")
                                serverOn = true
                            }
                            else {
                                wrongLocation("機房")
                            }
                            break

                        case ("我 檢視 主機"):
                            if (location == "機房") {
                                typewriter("我發現這台主機接到的螢幕居然和教室那臺接到的是一樣的，這是怎麼設定的？")
                            }
                            else {
                                wrongLocation("機房")
                            }
                            break

                        case ("我 開啟 瀏覽器"):
                            if (location == "電腦") {
                                if (internet) {
                                    if (unlockedABC) {
                                        typewriter("電腦已經接上網路了。我打開電腦上的瀏覽器，螢幕顯示出一個警告，上面寫著：「儲存空間已耗盡，並且有三個環境變數設置錯誤。」我發現這三個環境變數的「甲」、「乙」、「丙」的值設錯了，「甲」的值設成了「乙」、「乙」的值設成了「丙」、「丙」的值設成了「甲」。我必須更改它們才能繼續使用瀏覽器。")
                                        setTimeout(() => {
                                            document.addEventListener('click', () => {
                                                unlock.style.display = 'block'
                                            },
                                                { once: true })
                                        }, 1000);
                                    } else {
                                        typewriter("電腦已經接上網路了。我打開電腦上的瀏覽器，螢幕顯示出一個警告，上面寫著：「儲存空間已耗盡，並且有三個環境變數設置錯誤。」我的腦中一片空白，想不起來有哪些環境變數，更不用說知道要如何設定它們了。")
                                    }
                                } else {
                                    typewriter("當我嘗試啟動瀏覽器時，無法連線至網際網路的錯誤訊息依然不意外地跳出，現在的我，彷彿置身於一個無法觸及的外界的荒島中。")
                                }
                            }
                            else {
                                wrongLocation("電腦")
                            }
                            break

                        case ("我 檢視 角落"):
                            if (location == "機房") {
                                typewriter("路由器的角落有「甲」字卡。這不是一個詞彙，究竟有什麼作用？")
                                createCardElements(['甲'])
                            } else if (location == "電腦") {
                                typewriter("電腦的角落積滿了許多灰塵。我將灰塵撥開，發現一張「乙」字卡。")
                                createCardElements(['乙'])
                            } else if (location == "門") {
                                typewriter("門的角落有許多積水，水中的「丙」字卡若隱若現，我將它撿了起來。")
                                createCardElements(['丙'])
                            } else {
                                typewriter("這裡的角落沒有什麼特別的，也許我應該去其他地方。")
                            }
                            if (playerCards.includes("甲") && playerCards.includes("乙") && playerCards.includes("丙")) {
                                unlockedABC = true
                            }
                            break

                        case ("我 開啟 瀏覽器"):
                            if (location == "電腦") {
                                typewriter("電腦已經接上網路了。我打開電腦上的瀏覽器，螢幕顯示出一個警告，上面寫著：「儲存空間已耗盡，並且有三個環境變數設置錯誤。」我發現這三個環境變數的「甲」、「乙」、「丙」的值設錯了，「甲」的值設成了「乙」、「乙」的值設成了「丙」、「丙」的值設成了「甲」。我必須更改它們才能繼續使用瀏覽器。")
                            }
                            else {
                                wrongLocation("電腦")
                            }
                            break

                        case ("我 檢視 門"):
                            if (location == "門") {
                                typewriter("門已經開啟了，我還不出去嗎？")
                            }
                            else {
                                wrongLocation("門")
                            }
                            break
                            
                        default:
                            typewriter("我不了解句子的意思。")
                    }
                }

            } else {
                card.parentElement.removeChild(card)
                sidebar.appendChild(card)
            }
        })

        sidebar.appendChild(card)

    }
    cardCount.innerText = `${playerCards.length}/${nouns.length + verbs.length}`
}

function wrongLocation(location) {
    if (location == "教室" || location == "機房") {
        typewriter(`我不在${location}裡面，不能檢視${location}。`)
    } else {
        typewriter(`我不在${location}旁邊，不能檢視${location}。`)
    }
}

function locationChange(newLocation, textOverride) {
    if (textOverride) {
        typewriter(textOverride)
    } else {

        if (location == "教室" || location == "機房") {
            typewriter(`我從${location}裡面移動到了${newLocation}。`)
        } else {
            typewriter(`我從${location}旁邊移動到了${newLocation}。`)
        }
    }
    location = newLocation
}

function typewriter(text) {
    let i = 0
    const symbols = ['，', '。', '；', '？', '、', '\n']
    response.innerText = ""
    clickEventEnabled = false
    let animationRunning = true
    inner()
    document.getElementById('response').addEventListener('click', () => {
        response.innerText = text;
        animationRunning = false;
        clickEventEnabled = true;
    })

    function inner() {
        if (animationRunning) {
            if (i < text.length) {
                response.innerText += text.charAt(i)
                i++

                if (symbols.includes(text.charAt(i - 1))) {
                    setTimeout(inner, 500)
                } else {
                    setTimeout(inner, 100)
                }

            } else {
                clickEventEnabled = true
            }
        }
    }
}