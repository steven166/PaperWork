<div class="paper-startup">
    <style>
        #page-loader{
            position: fixed;
            width: 64px;
            height: 64px;
            top: 50%;
            left: 50%;
            margin-left: -32px;
            margin-top: -32px;
            border-radius: 100%;
            transform: rotate(-90deg);
            animation: intro 2.5s ease;
            -webkit-animation: intro 2.5s ease;
        }

        #page-loader svg{
            width: 64px;
            height: 64px;

            -webkit-animation: rotate 2s linear infinite;
            animation: rotate 2s linear infinite;
        }


        #page-loader svg circle{
            stroke-dasharray: 1,150; /* 1%, 101% circumference */
            stroke-dashoffset: 0;
            stroke: #333333;
            stroke-linecap: round;
            -webkit-animation: dash 1.5s ease-in-out infinite;
            animation: dash 1.5s ease-in-out infinite;
        }

        @keyframes rotate {
            100% { transform: rotate(360deg); }
        }
        @-webkit-keyframes rotate{
            100% { -webkit-transform: rotate(360deg); }
        }

        @keyframes dash {
            0% {
                stroke-dasharray: 1,150;  /* 1%, 101% circumference */
                stroke-dashoffset: 0;
            }
            50% {
                stroke-dasharray: 90,150; /* 70%, 101% circumference */
                stroke-dashoffset: -35;   /* 25% circumference */
            }
            100% {
                stroke-dasharray: 90,150; /* 70%, 101% circumference */
                stroke-dashoffset: -124;  /* -99% circumference */
            }
        }
        @-webkit-keyframes dash {
            0% {
                stroke-dasharray: 1,150;  /* 1%, 101% circumference */
                stroke-dashoffset: 0;
            }
            50% {
                stroke-dasharray: 90,150; /* 70%, 101% circumference */
                stroke-dashoffset: -35;   /* 25% circumference */
            }
            100% {
                stroke-dasharray: 90,150; /* 70%, 101% circumference */
                stroke-dashoffset: -124;  /* -99% circumference */
            }
        }

        @keyframes intro{
            0% {
                opacity: 0;
            }
            50% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }

        @-webkit-keyframes intro{
            0% {
                opacity: 0;
            }
            50% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
    </style>
    <div id="page-loader">
        <svg viewBox="0 0 52 52">
            <circle cx="26px" cy="26px" r="20px" fill="none" stroke-width="4px" />
        </svg>
    </div>
</div>