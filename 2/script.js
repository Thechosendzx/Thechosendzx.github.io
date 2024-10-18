// 获取画布和上下文
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


// 调整画布大小以匹配窗口
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 存储粒子的数组
let particles = [];

// 定义粒子的属性
class Particle {
    constructor(x, y, sizeModifier = 1) {
        this.x = x;
        this.y = y;
        this.size = (Math.random() * 2 + 0.5) * sizeModifier; // 粒子大小，通过sizeModifier调整区域粒子大小
        this.speedY = Math.random() * -2 - 0.5; // 粒子垂直向上速度
        this.speedX = Math.random() * 1 - 0.5; // 粒子水平随机漂移
        this.color = 'rgba(0, 0, 0, 1)'; // 粒子颜色像火花
        this.lifeSpan = 80; // 粒子生命周期
        this.opacity = 1; // 粒子初始透明度
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY; // 粒子向上移动
        this.lifeSpan--; // 生命周期减少
        this.opacity = this.lifeSpan / 100; // 透明度随着生命周期逐渐变淡
        if (this.lifeSpan < 0) {
            this.lifeSpan = 0;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`; // 使用透明度渐变
        ctx.fill();
    }
}

// 更新和绘制粒子
function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // 如果粒子生命值归零，移除该粒子
        if (particles[i].lifeSpan <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
}

// 鼠标移动时生成粒子的函数，保持不变
function generateParticles(x, y) {
    for (let i = 0; i < 3; i++) { // 每次生成 10 个粒子
        particles.push(new Particle(x, y)); // 默认sizeModifier保持1
    }
}

// 生成粒子区域的相对函数
function updateParticleAreas() {
    return [
        { xMin: 0, xMax: 0.16 * canvas.width, yMin: 0.34 * canvas.height, yMax: 0.44 * canvas.height },
        { xMin: 0.2 * canvas.width, xMax: 0.255 * canvas.width, yMin: 0.34 * canvas.height, yMax: 0.44 * canvas.height },       
        { xMin: 0.40 * canvas.width, xMax: 0.45 * canvas.width, yMin: 0.34 * canvas.height, yMax: 0.44 * canvas.height },        
        { xMin: 0.53 * canvas.width, xMax: 0.7 * canvas.width, yMin: 0.34 * canvas.height, yMax: 0.44 * canvas.height },        
        { xMin: 0.76 * canvas.width, xMax: 1 * canvas.width, yMin: 0.34 * canvas.height, yMax: 0.44 * canvas.height },    
        
        
        // 根据需要添加其他区域
    ];
}

// 定义区域
let particleAreas = updateParticleAreas();

// 在多个指定区域内生成粒子的函数
function generateParticlesInAreas() {
    // 只有在页面滚动不到 100px 时生成区域粒子
    if (window.scrollY < 100) {
        particleAreas.forEach(area => {
            for (let i = 0; i < 20; i++) { // 区域内生成 20 个粒子
                const x = Math.random() * (area.xMax - area.xMin) + area.xMin; // 限制在 x 的区域范围内
                const y = Math.random() * (area.yMax - area.yMin) + area.yMin; // 限制在 y 的区域范围内
                particles.push(new Particle(x, y, 1.5)); // 通过sizeModifier=1.5 让区域内粒子变大
            }
        });
    }
}

// 启动粒子生成
function startGeneratingParticles() {
    console.log("Starting particle generation"); // 确认粒子生成开始
    setInterval(generateParticlesInAreas, 100); // 每 100 毫秒生成一次粒子
}

// 在页面加载后 2 秒启动粒子生成
setTimeout(startGeneratingParticles, 1700); // 2000 毫秒，即 2 秒后开始生成粒子

// 动画循环
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布
    handleParticles(); // 更新和绘制粒子
    requestAnimationFrame(animate); // 动画循环
}

// 鼠标移动事件（生成跟随鼠标的粒子），保持不变
window.addEventListener('mousemove', function(event) {
    generateParticles(event.clientX, event.clientY); // 使用 clientX 和 clientY
});

// 监听窗口大小调整
window.addEventListener('resize', function() {
    // 更新画布的大小和粒子区域
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particleAreas = updateParticleAreas(); // 更新粒子生成区域
});

// 调整画布大小以匹配窗口
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas(); // 初始化时调整大小
window.addEventListener('resize', resizeCanvas); // 监听窗口大小调整


// 开始动画
animate();

function updateParticleAreasForTimeline() {
    const timelineLine = document.querySelector('.timeline-line'); // 获取时间线元素
    const rect = timelineLine.getBoundingClientRect(); // 获取时间线的位置

    return {
        leftArea: { 
            xMin: rect.left - 10, // 在时间线左侧稍微偏移
            xMax: rect.left, // 左侧区域的x最大值
            yMin: rect.top, 
            yMax: rect.bottom // 粒子高度跟随时间线高度
        },
        rightArea: { 
            xMin: rect.right, // 右侧区域的x最小值
            xMax: rect.right + 10, // 在时间线右侧稍微偏移
            yMin: rect.top, 
            yMax: rect.bottom // 粒子高度跟随时间线高度
        }
    };
}

function updateParticleAreasForTimeline() {
    const timelineLine = document.querySelector('.timeline-line'); // 获取时间线元素
    const rect = timelineLine.getBoundingClientRect(); // 获取时间线的位置

    return {
        leftArea: { 
            xMin: rect.left - 20, // 在时间线左侧稍微偏移
            xMax: rect.left, // 左侧区域的x最大值
            yMin: rect.top, 
            yMax: rect.bottom // 粒子高度跟随时间线高度
        },
        rightArea: { 
            xMin: rect.right, // 右侧区域的x最小值
            xMax: rect.right + 20, // 在时间线右侧稍微偏移
            yMin: rect.top, 
            yMax: rect.bottom // 粒子高度跟随时间线高度
        }
    };
}

function generateParticlesFromTimeline() {
    const { leftArea, rightArea } = updateParticleAreasForTimeline(); // 获取时间条左右区域

    // 在时间线左侧生成粒子
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * (leftArea.xMax - leftArea.xMin) + leftArea.xMin; // 在左侧区域生成
        const y = Math.random() * (leftArea.yMax - leftArea.yMin) + leftArea.yMin;
        particles.push(new Particle(x, y, 1)); // 向左漂移
    }

    // 在时间线右侧生成粒子
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * (rightArea.xMax - rightArea.xMin) + rightArea.xMin; // 在右侧区域生成
        const y = Math.random() * (rightArea.yMax - rightArea.yMin) + rightArea.yMin;
        particles.push(new Particle(x, y, 1)); // 向右漂移
    }
}

// 在页面加载后 2 秒启动区域和时间条粒子生成
setTimeout(startGeneratingParticles, 3000); // 2秒后开始生成粒子
setInterval(generateParticlesFromTimeline, 100); // 每 0.5 秒从时间线生成粒子










window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) { // 当用户滚动超过50px时
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // 添加透明白色背景
    } else {
        header.style.backgroundColor = 'transparent'; // 恢复透明背景
    }
});


// 获取页面中的 section 和导航链接
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");

// 获取 large-text 元素（代表首页的内容）
const largeText = document.querySelector(".large-text");

// 监听滚动事件
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;

    // 检查 large-text 是否在视口内
    const largeTextTop = largeText.offsetTop;
    const largeTextHeight = largeText.offsetHeight;

    if (scrollPosition >= largeTextTop - 100 && scrollPosition < largeTextTop + largeTextHeight) {
        navLinks.forEach(link => link.classList.remove("active")); // 移除所有链接的激活状态
        navLinks[0].classList.add("active"); // 添加 Home 对应的链接的激活状态
    } else {
        // 遍历每个 section，检查滚动位置
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - 100; // 偏移值
            const sectionHeight = section.offsetHeight;

            // 如果当前滚动位置在该 section 内
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove("active")); // 移除所有链接的激活状态
                navLinks[index + 1].classList.add("active"); // 添加当前 section 对应的链接的激活状态 (index + 1，因为 large-text 对应的 Home 是第一个)
            }
        });
    }
});



// 初始页面加载时调用一次，确保导航栏的正确颜色
window.dispatchEvent(new Event('scroll'));



navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        const targetId = this.getAttribute('href');

        // 检查是否是指向 PDF 文件的链接
        if (targetId.endsWith('.pdf')) {
            // 如果是 PDF 文件，允许默认行为（文件下载或打开）
            return;
        }

        // 如果是页面内的链接，阻止默认行为并平滑滚动
        event.preventDefault(); // 阻止默认行为
        
        const targetSection = document.querySelector(targetId);

        // 平滑滚动到目标 section
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth' // 平滑滚动
        });
    });
});


window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.floating-content');
    sections.forEach(section => {
        const scrollPosition = window.pageYOffset;
        // 设置悬浮内容根据滚动进行微小移动
        section.style.transform = `translateY(${scrollPosition * 0.1}px)`;
    });
});
 
document.addEventListener('DOMContentLoaded', () => {
    const timelinePoints = document.querySelectorAll('.timeline-point'); // 获取所有时间节点
    const timelineSection = document.getElementById('timeline'); // 获取 timeline 部分
    const timelineLine = document.querySelector('.timeline-line'); // 获取时间线

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const timelineTop = timelineSection.offsetTop;

        // 如果滚动到时间线部分，开始激活节点
        if (scrollPosition >= timelineTop - window.innerHeight / 1.5) {
            activateTimelineNodes(scrollPosition, timelineTop);
        }
    });

    // 激活时间线节点
    function activateTimelineNodes(scrollPosition, timelineTop) {
        timelinePoints.forEach((point, index) => {
            const pointTrigger = timelineTop + (index * (timelineSection.offsetHeight / timelinePoints.length));
            if (scrollPosition > pointTrigger - window.innerHeight / 1.5) {
                activateNode(point, index);
            } else {
                deactivateNode(point);
            }
        });
    }

    // 激活单个节点
    function activateNode(node, index) {
        node.style.opacity = 1;
        node.style.transform = 'scale(1)';

        // 如果是第一个节点，确保线条和节点延迟出现
        if (index === 0) {
            timelineLine.style.height = '10%'; // 逐渐显示线条
            timelineLine.style.opacity = 1; // 线条显现
        }

        // 动态改变时间线的高度和颜色
        const newHeight = (index + 1) * (100 / timelinePoints.length) + '%';
        timelineLine.style.height = newHeight;

    }

    // 取消激活单个节点
    function deactivateNode(node) {
        node.style.opacity = 0;
        node.style.transform = 'scale(0.9)';
    }
});

// Select the movie icon and media content elements
const movieIcon = document.getElementById('movie-icon');
const mediaContent = document.getElementById('media-content');
let isContentVisible = false;

// Function to show media content and hide movie icon
function showMediaContent() {
    mediaContent.classList.add('visible');
    movieIcon.classList.add('hidden');
    isContentVisible = true;
}

// Function to hide media content and show movie icon
function hideMediaContent() {
    mediaContent.classList.remove('visible');
    movieIcon.classList.remove('hidden');
    isContentVisible = false;
}

// Scroll event to handle automatic showing/hiding of media content
window.addEventListener('scroll', () => {
    const section = document.getElementById('interactive-section');
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Check if the user's view is within the interactive section
    if (scrollY + windowHeight > sectionTop + sectionHeight * 0.8 && scrollY < sectionTop + sectionHeight) {
        if (!isContentVisible) {
            showMediaContent();
        }
    } else if (scrollY + windowHeight < sectionTop + sectionHeight) {
        if (isContentVisible) {
            hideMediaContent();
        }
    }
});

// Initial call to ensure proper state if the user reloads within the section
window.addEventListener('load', () => {
    const section = document.getElementById('interactive-section');
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Check if the user's view is within the interactive section on load
    if (scrollY + windowHeight > sectionTop + sectionHeight * 0.01 && scrollY < sectionTop + sectionHeight) {
        showMediaContent();
    } else {
        hideMediaContent();
    }
});


    // Function to handle image visibility on scroll
    const handleVisibility = () => {
        galleryItems.forEach((img) => {
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.2) {
                img.style.opacity = '1';
                img.style.transform = 'translateX(0)';
            } else {
                img.style.opacity = '0';
                img.style.transform = 'translateX(-100px)';
            }
        });
    };


    // JavaScript to handle modal functionality
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const modal = document.getElementById('modal');
            const fullImage = document.getElementById('full-image');
            const caption = document.getElementById('caption');
            const img = this.querySelector('img');

            modal.style.display = 'block';
            fullImage.src = img.src;
            caption.innerHTML = img.alt;
        });
    });

    // Close modal when clicking on the close button
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('modal').style.display = 'none';
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('modal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });


    // 初始化 EmailJS
    (function(){
        emailjs.init("kNYnf5_lVudjMKRLN");  // 替换为你的 EmailJS 用户 ID
    })();

    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault(); // 阻止表单默认提交行为
    
        emailjs.sendForm('smtp.gmail.com', 'template_syg6utt', this)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Message sent successfully!');
            }, function(error) {
                console.log('FAILED...', error);  // 输出详细的错误信息
                alert('Failed to send message. Error: ' + JSON.stringify(error)); // 打印错误内容
            });
    });
    

    // JavaScript 动态更新时间
    document.getElementById('last-updated').innerText += new Date(document.lastModified).toLocaleString();


    document.addEventListener('DOMContentLoaded', function () {
        const scrollContainers = document.querySelectorAll('.scroll-container');
    
        // 使用 IntersectionObserver 来检测元素进入视口
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const scrollText = entry.target.querySelector('.scroll-text');
                if (entry.isIntersecting) {
                    // 添加 scroll-active 类以启动动画
                    scrollText.classList.add('scroll-active');
                } else {
                    // 离开视口时暂停动画
                    scrollText.classList.remove('scroll-active');
                }
            });
        }, { threshold: 0.5 }); // 当元素进入视口50%时触发
    
        // 观察每个滚动容器
        scrollContainers.forEach(container => {
            observer.observe(container);
        });
    });
    