<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    
</head>
<body style="margin-top:-30px;margin:0; min-height:100vh; gap:10px;display:flex; flex-direction:column;justify-content:center; align-items:center; background-color:rgb(254, 254, 254); font-family:Arial,sans-serif;">
    @auth
    <div style="max-width:700px; margin:40px auto; font-family:Arial,sans-serif;">

        <div style="background-color:white; padding:15px 20px; border-radius:12px; box-shadow:0 5px 18px rgba(0,0,0,0.10); display:flex; align-items:center; justify-content:space-between; margin-bottom:25px;">
            <p style="margin:0; color:#4b3f72; font-weight:bold;">Loged in</p>

            <form action="/logout" method="POST" style="margin:0;">
                @csrf
                <button style="border:none; background-color:#ec258f; color:white; padding:8px 15px; border-radius:7px; font-weight:bold; cursor:pointer;">
                    Logout
                </button>
            </form>
        </div>

        <div style="background-color:white; padding:25px; border-radius:15px; box-shadow:0 8px 25px rgba(0,0,0,0.10);">
            <h2 style="margin:0 0 20px; color:#4b3f72; font-size:24px;">Create a new post</h2>

            <form action="/create-post" method="POST">
                <input name="title" type="text" placeholder="Title" style="width:100%; box-sizing:border-box; padding:12px; margin-bottom:12px; border:1px solid #ddd; border-radius:8px; font-size:14px; outline:none;">

                <textarea name="body" placeholder="Description" style="width:100%; height:130px; box-sizing:border-box; padding:12px; margin-bottom:12px; border:1px solid #ddd; border-radius:8px; font-size:14px; font-family:Arial,sans-serif; resize:vertical; outline:none;"></textarea>

                <button style="width:100%; border:none; background-color:#6c5ce7; color:white; padding:12px; border-radius:8px; font-weight:bold; font-size:14px; cursor:pointer;">
                    Save post
                </button>
            </form>
        </div>

    <div style="max-width:700px; margin:30px auto; font-family:Arial,sans-serif;">

            <h2 style="color:#4b3f72; margin-bottom:20px;">All posts</h2>

            @foreach($posts as $post)

            <div style="background-color:white; padding:20px; margin-bottom:15px; border-radius:12px; box-shadow:0 6px 20px rgba(0,0,0,0.08); border-left:4px solid #6c5ce7;">
                <h3 style="margin:0 0 10px; color:#403568; font-size:20px;">
                    {{$post['title']}}
                </h3>

                <p style="margin:0; color:#666; font-size:15px; line-height:1.5;">
                    {{$post['body']}}
                </p>
            </div>

            @endforeach

        </div>

</div>

    @else
        <header style="display:flex; align-items:center; justify-content:center; gap:25px; background: linear-gradient(157deg, #6e00b8 0%, #bf00ff 24%, #ff00ff 49%, #ff0051 74%, #fadf0f 100%); border-radius:40px; padding:30px 30px">

            <div style="background-color:#ffffff; width:320px; padding:25px; border-radius:16px; text-align:center; box-shadow:0 10px 30px rgba(50,40,100,0.18);">
                <h2 style="margin:0 0 22px; color:#403568; font-size:25px;">Register</h2>

                <form action="/register" method="POST">
                    @csrf
                    <input type="text" name="name" placeholder="Name" style="width:100%; box-sizing:border-box; padding:12px; margin-bottom:11px; border:1px solid #ddd8f5; border-radius:9px; outline:none; font-size:14px; background-color:#faf9ff;">
                    <input type="email" name="email" placeholder="Email" style="width:100%; box-sizing:border-box; padding:12px; margin-bottom:11px; border:1px solid #ddd8f5; border-radius:9px; outline:none; font-size:14px; background-color:#faf9ff;">
                    <input type="password" name="password" placeholder="Password" style="width:100%; box-sizing:border-box; padding:12px; margin-bottom:17px; border:1px solid #ddd8f5; border-radius:9px; outline:none; font-size:14px; background-color:#faf9ff;">
                    <button type="submit" style="width:100%; padding:12px; border:none; border-radius:9px; background-color:#6c5ce7; color:white; font-weight:bold; font-size:14px; cursor:pointer;">Register</button>
                </form>
            </div>

            <div style="background-color:#ffffff; width:320px; padding:25px; border-radius:16px; text-align:center; box-shadow:0 10px 30px rgba(50,40,100,0.18);">
                <h2 style="margin:0 0 22px; color:#403568; font-size:25px;">Log in</h2>

                <form action="/login" method="POST">
                    @csrf
                    <input type="text" name="loginname" placeholder="Name" style="width:100%; box-sizing:border-box; padding:12px; margin-bottom:11px; border:1px solid #ddd8f5; border-radius:9px; outline:none; font-size:14px; background-color:#faf9ff;">
                    <input type="password" name="loginpassword" placeholder="Password" style="width:100%; box-sizing:border-box; padding:12px; margin-bottom:17px; border:1px solid #ddd8f5; border-radius:9px; outline:none; font-size:14px; background-color:#faf9ff;">
                    <button type="submit" style="width:100%; padding:12px; border:none; border-radius:9px; background-color:#6c5ce7; color:white; font-weight:bold; font-size:14px; cursor:pointer;">Log in</button>
                </form>
            </div>

        </header>

        

        
    @endauth


    

</body>
</html>