function detectUserAgent(device) {
    var user_agent;

    switch (device) {
        case 'Samsung Galaxy S6':
            user_agent = 'Mozilla/5.0 (Linux; Android 6.0.1; SM-G920V Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36';
            break;
        case 'Samsung Galaxy S6 Edge Plus':
            user_agent = 'Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36';
            break;
        case 'Microsoft Lumia 950':
            user_agent = 'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/13.10586';
            break;
        case 'Nexus 6P':
            user_agent = 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 6P Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36';
            break;
        case 'Sony Xperia Z5':
            user_agent = 'Mozilla/5.0 (Linux; Android 6.0.1; E6653 Build/32.2.A.0.253) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36';
            break;
        case 'HTC One M9':
            user_agent = 'Mozilla/5.0 (Linux; Android 6.0; HTC One M9 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36';
            break;
        case 'Google Pixel C':
            user_agent = 'Mozilla/5.0 (Linux; Android 7.0; Pixel C Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36';
            break;
        case 'Sony Xperia Z4 Tablet':
            user_agent = 'Mozilla/5.0 (Linux; Android 6.0.1; SGP771 Build/32.2.A.0.253; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36';
            break;
        case 'Nvidia Shield Tablet':
            user_agent = 'Mozilla/5.0 (Linux; Android 5.1.1; SHIELD Tablet Build/LMY48C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Safari/537.36';
            break;
        case 'Samsung Galaxy Tab A':
            user_agent = 'Mozilla/5.0 (Linux; Android 5.0.2; SAMSUNG SM-T550 Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.3 Chrome/38.0.2125.102 Safari/537.36';
            break;
        case 'Amazon Kindle Fire HDX 7':
            user_agent = 'Mozilla/5.0 (Linux; Android 4.4.3; KFTHWI Build/KTU84M) AppleWebKit/537.36 (KHTML, like Gecko) Silk/47.1.79 like Chrome/47.0.2526.80 Safari/537.36';
            break;
        case 'LG G Pad 7.0':
            user_agent = 'Mozilla/5.0 (Linux; Android 5.0.2; LG-V410/V41020c Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/34.0.1847.118 Safari/537.36';
            break;
        case 'Apple TV 4th Gen':
            user_agent = 'AppleTV5,3/9.1.1';
            break;
        case 'Edge':
            user_agent = 'Edge';
            break;
        case 'Chrome':
            user_agent = 'Chrome';
            break;
        case 'Mozilla':
            user_agent = 'Mozilla';
            break;
        case 'Opera':
            user_agent = 'Opera';
            break;
        case 'Safari':
            user_agent = 'Safari';
            break;
        case 'Iphone':
            user_agent = 'Iphone';
            break;
        case 'Ipad':
            user_agent = 'Ipad';
            break;
        default:
            user_agent = 'Unknown';
    }

    return user_agent;
}