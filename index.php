<?php
// Einfache Modularität ohne Overhead
$pageTitle = "Modern Tetris - Retro & Neon";
include 'includes/header.php';
?>

<div id="game-container">
    <div id="ui-layer">
        <div class="stat-box">
            <div class="label">PUNKTE</div>
            <div id="score">0</div>
        </div>
        <div class="stat-box">
            <div class="label">HIGHSCORE</div>
            <div id="highscore">0</div>
        </div>
        <div class="stat-box">
            <div class="label">LEVEL</div>
            <div id="level">1</div>
        </div>
    </div>

    <canvas id="tetris" width="240" height="400"></canvas>

    <div id="mobile-controls">
        <button id="btn-left" class="ctrl-btn">◀</button>
        <button id="btn-rotate" class="ctrl-btn">↻</button>
        <button id="btn-right" class="ctrl-btn">▶</button>
        <button id="btn-down" class="ctrl-btn">▼</button>
    </div>

    <div id="menu">
        <button id="theme-toggle">Theme wechseln</button>
        <button id="reset-highscore">Highscore Reset</button>
    </div>
</div>

<?php include 'includes/footer.php'; ?>