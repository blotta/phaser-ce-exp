window.onload = function() {

    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamewindow', { preload: preload, create: create, update: update });

    function preload () {

        let images = [
            'square_red',
            'square_green', 
            'square_yellow',
            'square_blue'  ,
            'seamless_grass'
        ];

        for (let img of images) {
            game.load.image("spr_" + img, "assets/" + img + ".png");
        }
        game.load.spritesheet('bricks', 'assets/brickbreaker-bricks-tilesheet.png', 50, 25);
        game.load.spritesheet('tiles_ground', 'assets/platform-ground-tilesheet.png', 64, 64);
        game.load.spritesheet('office_character', 'assets/office_character_tilesheet.png', 16, 16);
    }

    function create () {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        // game.add.sprite(0, 0, 'background');

        platforms = game.add.group();
        platforms.enableBody = true; // enable physics
        var ground = platforms.create(0, game.world.height - 64, 'tiles_ground', 0);
        ground.scale.setTo(14, 1);
        ground.body.immovable = true;
        // ground.body.friction = 0;

        player = game.add.sprite(32, game.world.height - 150, 'office_character');
        player.smoothed = false;
        player.scale.setTo(2, 2);
        player.anchor.setTo(0.5, 1);
        game.physics.arcade.enable(player);

        player.body.bounce.y = 0.2;
        player.body.gravity.y = 1000;
        player.body.collideWorldBounds = true;

        player.animations.add('idle', [0], 10, true);
        player.animations.add('right', [3, 4, 5, 6], 10, true);
        player.animations.add('left', [3, 4, 5, 6], 10, true);
        player.animations.add('jumpUp', [12], 10, true);
        player.animations.add('falling', [13], 10, true);


        cubes = game.add.group();
        cubes.enableBody = true;
        var r = cubes.create(48, 0, 'spr_square_red');
        r.scale.setTo(0.5, 0.5);
        r.body.gravity.y = 60;
        r.body.bounce.y = 0.7 + Math.random() * 0.2;

        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {

        var hitPlatform = game.physics.arcade.collide(player, platforms);


        var animToPlay = player.animations.currentAnim.name;

        if (player.body.touching.down && hitPlatform) {
            player.body.velocity.x = 0;
            if (cursors.right.isDown) {
                player.body.velocity.x = 150;
                player.scale.x = Math.abs(player.scale.x);
                player.animations.play('right');
                animToPlay = 'right';
            } else if (cursors.left.isDown) {
                player.body.velocity.x = -150;
                player.scale.x = -Math.abs(player.scale.x);
                player.animations.play('left');
                animToPlay = 'left';
            } else {
                player.animations.stop();
                animToPlay = 'idle';
            }
        }

        if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
            player.body.velocity.y = -350;
            animToPlay = 'jumpUp';
        } else if (!player.body.touching.down) {
            animToPlay = player.body.velocity.y > 0 ? 'falling' : 'jumpUp';
        }

        if (animToPlay === '') {
            player.animations.stop();
        } else {
            player.animations.play(animToPlay);
        }

        game.physics.arcade.collide(cubes, platforms);
        game.physics.arcade.overlap(player, cubes, collectCube, null, this);
    }

    function collectCube(player, cube) {
        cube.kill();
    }

};