<?php
$pageTitle = "Ron's Retro Stacker";
include 'includes/header.php';
?>

<div id="game-container">
    <div id="ui-top">
        <div class="stat-box"><div class="label">Score</div><div id="score">0</div></div>
        <div class="stat-box"><div class="label">High</div><div id="highscore">0</div></div>
        <div class="stat-box"><div class="label">Level</div><div id="level">1</div></div>
    </div>

    <div id="stage">
        <div id="canvas-wrapper">
            <canvas id="tetris" width="240" height="400"></canvas>
            <div id="pause-overlay">
                <div id="pause-text">PAUSE</div>
                <button id="start-btn">SPIEL STARTEN</button>
            </div>
        </div>

        <div id="next-preview">
            <div class="label">Next</div>
            <canvas id="next0" width="60" height="60"></canvas>
            <div class="label" style="margin-top:10px; opacity:0.5;">Queue</div>
            <canvas id="next1" width="50" height="50"></canvas>
            <canvas id="next2" width="50" height="50"></canvas>
        </div>
    </div>

    <div id="mobile-controls">
        <button id="btn-left" class="ctrl-btn">◀</button>
        <button id="btn-rotate" class="ctrl-btn">↻</button>
        <button id="btn-right" class="ctrl-btn">▶</button>
        <button id="btn-down" class="ctrl-btn">▼</button>
    </div>

    <div id="menu">
        <button id="pause-btn" class="menu-btn">Pause</button>
        <button id="theme-toggle" class="menu-btn">Theme</button>
        <button id="reset-highscore" class="menu-btn">Reset</button>
    </div>

    <footer id="game-footer">
        <p>Ron's Retro Stacker &bull; v1.2 &bull; <?= date("Y"); ?></p>
    </footer>
</div>

<?php include 'includes/footer.php'; ?>