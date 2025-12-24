class NotificationDTO {
  constructor(notification) {
    this.id = notification.id;
    this.title = notification.title;
    this.message = notification.message;
    this.type = notification.type;
    this.is_read = notification.is_read;
    this.related_id = notification.related_id;
    this.created_at = notification.created_at;
  }

  static fromModel(notification) {
    return new NotificationDTO(notification);
  }

  static fromList(notifications) {
    return notifications.map((n) => new NotificationDTO(n));
  }
}

module.exports = { NotificationDTO };
