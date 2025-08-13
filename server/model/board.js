class Post{
constructor(board_id, user_id, title, content,createdAt) {
        this.board_id = board_id;
        this.user_id = user_id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt; // 생성 시점의 타임스탬프
    }
}
 exports = Post;