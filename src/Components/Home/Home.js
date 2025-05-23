import React, { useRef, useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import * as scoreServices from '../../Services/dbServices'
import { useAuthContext } from '../../Contexts/authContext';

import './Home.css';

const Home = props => {

    let user = useAuthContext().user;
    const canvasRef = useRef(null);
    const playerRef = useRef(null);
    const keys = useRef(null);
    const projectiles = useRef([]);
    const invaders = useRef(null);
    let gameOver = useRef(false);
    let active = useRef(true);
    const particles = useRef([]);
    let userInfo = useRef(null).current;
    let shotInterval = null;

    const navigate = useNavigate();

    let frames = 0;
    let randomIntervals = Math.floor((Math.random() * 30) + 30);

    useEffect(() => {
        const userInfoForReq = {
            userId: user._id,
            bestScore: 0
        }

        scoreServices.getScore(userInfoForReq)
            .then(res => res.json())
            .then(resData => {
                userInfo = resData
                let bestScore = document.querySelector('#bestScore');
                bestScore.textContent = userInfo.bestScore;
            })
    }, [user._id])

    class Player {
        constructor() {
            this.velocity = {
                x: 0,
                y: 0
            };
            this.lives = 3;
            this.points = 0;
            this.opacity = 1;

            let image = new Image();
            const canvas = canvasRef.current
            const c = canvas.getContext('2d')
            image.src = './spaceship.png';

            image.onload = () => {
                let scale = 0.6;
                this.image = image;
                this.width = image.width * scale;
                this.height = image.height * scale;
                this.position = {
                    x: canvas.width / 2 - this.width / 2,
                    y: canvas.height - this.height
                };

            }
        }

        draw() {
            const canvas = canvasRef.current;
            const c = canvas.getContext('2d');

            c.save();
            c.globalAlpha = this.opacity;
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
            c.restore();

        };

        update() {
            if (this.image) {
                this.draw();
                this.position.x += this.velocity.x;
            }
        }
    }

    class Projectile {
        constructor({ position, velocity }) {
            this.position = position;
            this.velocity = velocity;

            this.radius = 3;
        }



        draw() {
            const canvas = canvasRef.current;
            const c = canvas.getContext('2d');
            c.beginPath();
            c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
            c.fillStyle = 'red';
            c.fill();
            c.closePath();
        }

        update() {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }

    class Invader {
        constructor() {

            this.velocity = {
                x: 0,
                y: 6
            };

            this.position = {
                x: getRandomPosition(),
                y: 0
            }

            let image = new Image();
            const canvas = canvasRef.current
            const c = canvas.getContext('2d')
            image.src = './invader.png';

            image.onload = () => {
                let scale = 0.04;
                this.image = image;
                this.width = image.width * scale;
                this.height = image.height * scale;

            }
        }

        draw() {
            const canvas = canvasRef.current;
            const c = canvas.getContext('2d');
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        };

        update() {
            if (this.image) {
                this.draw();
                this.position.y += this.velocity.y;
            }
        }
    }

    class Particle {
        constructor({ position, velocity, radius, color, fades }) {
            this.position = position;
            this.velocity = velocity;
            this.radius = radius;
            this.color = color;
            this.opacity = 1;
            this.fades = fades
        }

        draw() {

            const canvas = canvasRef.current;
            const c = canvas.getContext('2d');

            c.save();
            c.globalAlpha = this.opacity;
            c.beginPath();
            c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
            c.fillStyle = this.color;
            c.fill();
            c.closePath();
            c.restore()
        }

        update() {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            if (this.fades) {
                this.opacity -= 0.01;
            }
        }
    }

    function creteParticles({ object, color, fades }) {
        for (let index = 0; index < 15; index++) {
            particles.current.push(new Particle({
                position: {
                    x: object.position.x + object.width / 2,
                    y: object.position.y + object.height / 2
                },
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2
                },
                radius: Math.random() * 7,
                color: color || 'white',
                fades
            }))
        }
    }

    function animate() {
        if (gameOver.current) {
            return navigate('/gameover', {
                state: { 'score': playerRef.current.points }
            })
        }

        requestAnimationFrame(animate);
        const canvas = canvasRef.current;
        const c = canvas.getContext('2d');
        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height);
        playerRef.current.update();
        let scoreEl = document.querySelector('#score');
        let livesEl = document.querySelector('#lives');

        particles.current.forEach((particle, i) => {
            if (particle.position.y - particle.radius >= canvas.height) {
                particle.position.x = Math.random() * canvas.width;
                particle.position.y = - particle.radius;
            }
            if (particle.opacity <= 0) {
                particles.current.splice(i, 1)
            } else {
                particle.update()
            }
        });

        projectiles.current.forEach((projectile, index) => {
            if (projectile.position.y + projectile.radius <= 0) {
                projectiles.current.splice(index, 1)
            } else {
                projectile.update();
            }
        });

        if (frames % randomIntervals === 0) {
            const newInvaders = [...invaders.current, new Invader()];
            invaders.current = newInvaders;
            randomIntervals = Math.floor((Math.random() * 60) + 100);
        };

        invaders.current.forEach((invader, i) => {
            if (frames > 60) {
                if (invader.position.y - invader.height >= canvas.height) {
                    invaders.current.splice(i, 1);
                } else {
                    invader.update();
                }

                const distansX = (invader.position.x + invader.width / 2) - (playerRef.current.position.x + playerRef.current.width / 2);
                const distansY = (invader.position.y + invader.height / 2) - (playerRef.current.position.y + playerRef.current.height / 2)
                const distance = Math.sqrt(distansX ** 2 + distansY ** 2);

                if (distance < invader.width / 2.5 + playerRef.current.width / 3) {
                    creteParticles({
                        object: invader,
                        color: 'green',
                        fades: true
                    });
                    creteParticles({
                        object: playerRef.current,
                        color: 'white',
                        fades: true
                    });

                    playerRef.current.lives--;
                    livesEl.textContent = playerRef.current.lives;
                    invaders.current.splice(i, 1);

                    if (playerRef.current.lives <= 0) {
                        playerRef.current.opacity = 0;

                        if (playerRef.current.points > userInfo?.bestScore) {
                            scoreServices.updateScore({ userId: userInfo.userId, bestScore: playerRef.current.points })
                                .then()
                        }
                        active.current = false
                        return setTimeout(() => {
                            gameOver.current = true;

                        }, 1500);

                    }
                }
            }

            projectiles.current.forEach((projectile, index) => {


                // const distansX = (invader.position.x + invader.width / 2) - (playerRef.current.position.x + playerRef.current.width / 2);
                // const distansY = (invader.position.y + invader.height / 2) - (playerRef.current.position.y + playerRef.current.height / 2)
                // const distance = Math.sqrt(distansX ** 2 + distansY ** 2);

                // if (distance < invader.width / 2.5 + playerRef.current.width / 3)

                const startPosition = invader.position.x - projectile.radius;
                const endPosition = invader.position.x + invader.width + projectile.radius;
                const startPositionY = invader.position.y - projectile.radius;
                const endPositionY = invader.position.y + invader.height + projectile.radius;
                if (
                    projectile.position.x > startPosition && projectile.position.x <= endPosition &&
                    projectile.position.y > startPositionY && projectile.position.y <= endPositionY

                ) {
                    creteParticles({
                        object: invader,
                        color: 'green',
                        fades: true
                    });

                    invaders.current.splice(i, 1);
                    projectiles.current.splice(index, 1);

                    playerRef.current.points += 10;
                    scoreEl.textContent = playerRef.current.points

                }
            })
        });

        frames++

        const player = playerRef.current;
        if (keys.current.a.pressed && player.position.x >= (canvas.width < 600 ? 0 : 300)) {
            player.velocity.x = -10;
        } else if (keys.current.d.pressed && player.position.x + player.width <= (canvas.width < 600 ? canvas.width : canvas.width - 300)) {
            player.velocity.x = 10;
        } else {
            player.velocity.x = 0;
        }
    }

    function updateKeys(key, keys, keyDown, projectiles) {

        if (!active.current) return;

        const newKeys = { ...keys.current };
        const newProjectiles = [...projectiles.current];
        switch (key) {
            case 'ArrowLeft':
                newKeys.a.pressed = keyDown;
                break;
            case 'ArrowRight':
                newKeys.d.pressed = keyDown;
                break;
            case ' ':
            case 'touchstart':
                if (keyDown) {
                    newProjectiles.push(new Projectile({
                        position: {
                            x: playerRef.current.position.x + playerRef.current.width / 2,
                            y: playerRef.current.position.y
                        },
                        velocity: {
                            x: 0,
                            y: -10
                        }
                    }));

                }

                newKeys.space.pressed = keyDown;
                newKeys.touchstart.pressed = keyDown;
                break;
        }

        keys.current = newKeys;
        projectiles.current = newProjectiles;
    }

    function touchMoveHandler(e, canvasWidth) {
        if (e.targetTouches[0].clientX <= playerRef.current.position.x + playerRef.current.width &&
            e.targetTouches[0].clientX >= playerRef.current.position.x &&
            e.targetTouches[0].clientY >= playerRef.current.position.y
        ) {
            if (e.targetTouches[0].clientX <= canvasWidth - (playerRef.current.width / 2) &&
                e.targetTouches[0].clientX >= 0 + (playerRef.current.width / 2)) {
                playerRef.current.position.x = e.targetTouches[0].clientX - playerRef.current.width / 2;
            }
        }
    }

    function shotOnToch(e, key, keys, keyDown, projectiles) {
        if (e.targetTouches[0].clientX <= playerRef.current.position.x + playerRef.current.width &&
            e.targetTouches[0].clientX >= playerRef.current.position.x &&
            e.targetTouches[0].clientY >= playerRef.current.position.y
        ) {
            shotInterval = setInterval(() => updateKeys(key, keys, keyDown, projectiles), 200)
        }
    }

    function getRandomPosition() {
        let max = (canvasRef.current.width - 300) - 76.8;
        let min = 300;
        return Math.random() * (max - min) + min;
    }

    useEffect(() => {
        const canvas = canvasRef.current


        if (window.navigator.maxTouchPoints >= 1) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        } else {
            canvas.width = window.innerWidth - 10;
            canvas.height = window.innerHeight - 5;
        }
        const canvasWidth = canvas.width;


        for (let index = 0; index < 100; index++) {
            particles.current.push(new Particle({
                position: {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height
                },
                velocity: {
                    x: 0,
                    y: 0.4
                },
                radius: Math.random() * 2,
                color: 'white',
            }))
        }

        playerRef.current = new Player();
        keys.current = {
            a: {
                pressed: false
            },
            d: {
                pressed: false
            },
            space: {
                pressed: false
            },
            touchstart: {
                pressed: false
            }
        };

        projectiles.current = [];
        invaders.current = [];

        animate();

        window.addEventListener('keydown', ({ key }) => {
            if (!active.current) return;
            updateKeys(key, keys, true, projectiles);
        });

        window.addEventListener('keyup', ({ key }) => updateKeys(key, keys, false, projectiles));
        window.addEventListener('touchstart', (e) => {
            if (!active.current) return;
            shotOnToch(e, 'touchstart', keys, true, projectiles)
        });
        window.addEventListener('touchmove', (e) => touchMoveHandler(e, canvasWidth));
        window.addEventListener('touchend', () => clearInterval(shotInterval));

    }, []);



    return <>
        <div className='nav-buttons'>
            <p className='score-lives'>
                <span>Score: <span id='score'>0</span></span>
                <span>Lives: <span id='lives'>3</span></span>
            </p>
            <div className='best-score'>
                <span>Best score: <span id='bestScore'></span></span>
                <Nav.Link className='nav-button' onClick={() => gameOver.current = true} >End Game</Nav.Link>
            </div>
        </div>

        <canvas ref={canvasRef} {...props} />
    </>
}

export default Home;