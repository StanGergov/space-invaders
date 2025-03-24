import React, { useRef, useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './Home.css';

const Home = props => {

    let [gameOver, setGameOver] = useState(false);

    class Player {
        constructor() {
            this.velocity = {
                x: 0,
                y: 0
            };
            this.lives = 3;
            this.points = 0;

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
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
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
                y: 2
            };

            this.position = {
                x: getRandomPosition(),
                y: 50
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

    let frames = 0;
    let randomIntervals = Math.floor((Math.random() * 70) + 70);

    function animate() {
        console.log(gameOver);
        
        if (gameOver) return
        requestAnimationFrame(animate);
        const canvas = canvasRef.current;
        const c = canvas.getContext('2d');
        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height);
        playerRef.current.update();
        let scoreEl = document.querySelector('#score');
        let livesEl = document.querySelector('#lives');


        if (playerRef.current.lives <= 0) {

            return setGameOver = true
        }

        if (frames == 0) {
            invaders.current.push(new Invader());
        }

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
            randomIntervals = Math.floor((Math.random() * 100) + 200);
        }

        invaders.current.forEach((invader, i) => {
            if (frames > 100) {
                if (invader.position.y - invader.height >= canvas.height) {
                    invaders.current.splice(i, 1);
                } else {
                    invader.update();
                }


                if (invader.position.y + invader.height >= playerRef.current.position.y
                    && invader.position.x + invader.width >= playerRef.current.position.x
                    && invader.position.x <= playerRef.current.position.x + playerRef.current.width
                ) {
                    playerRef.current.lives--;
                    livesEl.textContent = playerRef.current.lives
                    invaders.current.splice(i, 1);
                }
            }



            projectiles.current.forEach((projectile, index) => {
                const startPosition = invader.position.x - projectile.radius;
                const endPosition = invader.position.x + invader.width + projectile.radius;
                const startPositionY = invader.position.y - projectile.radius;
                const endPositionY = invader.position.y + invader.height + projectile.radius;
                if (
                    projectile.position.x > startPosition && projectile.position.x <= endPosition &&
                    projectile.position.y > startPositionY && projectile.position.y <= endPositionY

                ) {
                    invaders.current.splice(i, 1);
                    projectiles.current.splice(index, 1);

                    playerRef.current.points += 10;
                    scoreEl.textContent = playerRef.current.points

                }
            })
        });

        frames++

        const player = playerRef.current;
        if (keys.current.a.pressed && player.position.x >= 300) {
            player.velocity.x = -7;
        } else if (keys.current.d.pressed && player.position.x + player.width <= canvas.width - 300) {
            player.velocity.x = 7;
        } else {
            player.velocity.x = 0;
        }
    }

    function updateKeys(key, keys, keyDown = true, projectiles) {

        const newKeys = { ...keys.current };
        const newProjectiles = [...projectiles.current]

        switch (key) {
            case 'a':
                newKeys.a.pressed = keyDown;
                break;
            case 'd':
                newKeys.d.pressed = keyDown;
                break;
            case ' ':
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
                break;
        }

        keys.current = newKeys;
        projectiles.current = newProjectiles;

    }

    function getRandomPosition() {
        return Math.random() * (((canvasRef.current.width - 300) - 300) - 220) + 220;
    }

    const canvasRef = useRef(null);
    const playerRef = useRef(null);
    const keys = useRef(null);
    const projectiles = useRef(null);
    const invaders = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current
        
        canvas.width = window.innerWidth - 10;
        canvas.height = window.innerHeight - 10;

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
        };

        projectiles.current = [];
        invaders.current = [];

        animate();


        window.addEventListener('keydown', ({ key }) => updateKeys(key, keys, true, projectiles));

        window.addEventListener('keyup', ({ key }) => updateKeys(key, keys, false, projectiles));


    }, [animate, Invader, Player, updateKeys]);



    return <>
        <div className='nav-buttons'>
            <p>
                <span>Score:</span> <span id='score'>0</span>
                <span>Lives:</span> <span id='lives'>3</span>
            </p>
            <div>
                <Nav.Link className='nav-button' as={Link} >My scores</Nav.Link>
                <Nav.Link className='nav-button' onClick={setGameOver = true} as={Link} to="/logout">Logout</Nav.Link>
            </div>
        </div>

        <canvas ref={canvasRef} {...props} />
    </>
}

export default Home;