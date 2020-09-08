            const setup = (cards) => {
                let prev;
                for (var i = 0; i < cards.length; i++) {
                    const card = cards[i];
                    const radio = card.getElementsByTagName("input")[0];

                    radio.addEventListener("change", function () {
                        if (card !== prev) {
                            if (prev) prev.classList.remove("active");
                            prev = card;
                        }
                        if (card.classList.contains)
                            card.classList.add("active");
                    });
                }
            };

            setup(document.querySelectorAll("label.method"));
            setup(document.querySelectorAll("label.card"));