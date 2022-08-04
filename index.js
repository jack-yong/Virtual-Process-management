
		var insertonthread = 1000;
		var onthread2inthread = 1001;
		var inthread2onthread = 1002;
		var inthread2outthread = 1003;
		var outthread2onthread = 1004;
		var pid_init = 1;
		var zhongduan = 5;
		var shijianpian = 20;
		var rongliang = 10;
		var Cpu = 2;
		var zhenlu = 500;
		var Mqueue1 = new LinkedQueue();
		var Mqueue2 = new LinkedQueue();
		var Mqueue3 = new LinkedQueue();

		function Mythread(M_pid, M_name, M_time) {
			this.Mpid = M_pid;
			this.Mname = M_name;
			this.Mtime = M_time;
			this.Mshijianpian = shijianpian;
			this.jishi = 0;
			//alert(this.Mpid+this.Mname+this.Mtime+this.Mshijianpian+this.jishi);
		}

		function LinkedQueue() {
			//节点结构定义  
			var Node = function (element) {
				this.element = element;
				this.next = null;
			}

			var length = 0,
				front,//队首指针  
				rear;//队尾指针  
			//入队操作  
			this.push = function (element) {
				var node = new Node(element),
					current;
				//alert(node.element.Mname);
				if (length == 0) {
					front = node;
					rear = node;
					length++;
					// alert(rear.element.Mpid + "被放入" + "当前队列长度为" + length);

					return true;
				} else {
					current = rear;
					current.next = node;
					rear = node;
					length++;
					// alert(rear.element.Mpid + "被放入" + "当前队列长度为" + length);


					return true;
				}
			}
			//出队操作  
			this.pop = function () {
				if (!front) {
					return 'Queue is null';
				} else {
					var current = front;
					front = current.next;
					current.next = null;
					if (current == rear) {
						rear = front;
					}
					length--;
					// alert(current.element.Mpid + "被删除" + "当前队列长度为" + length)
					return current;
				}
			}
			//获取队长  
			this.size = function () {
				return length;
			}
			//获取队首  
			this.getFront = function () {
				return front;
			}
			//获取队尾  
			this.getRear = function () {
				return rear;
			}

			//清除队列  
			this.clear = function () {
				front = null;
				rear = null;
				length = 0;
				return true;
			}

			//遍历队列
			this.traver = function () {
				var lingshi_node = front;
				var pos = 0;
				while (lingshi_node) {
					//alert(lingshi_node.element.jishi);
					//alert(zhongduan);
					lingshi_node.element.jishi += zhenlu;
					if (lingshi_node.element.jishi >= (zhongduan * 1000)) {
						// alert(lingshi_node.element.jishi);
						var mytab = document.getElementById("inthread_table");
						var mytab1 = document.getElementById("onthread_table");
						lingshi_node.element.Mtime -= zhongduan;
						lingshi_node.element.Mshijianpian -= zhongduan;
						var num2 = parseInt(lingshi_node.element.Mshijianpian);
						var num3 = parseInt(lingshi_node.element.Mtime);
						mytab.rows[pos].cells[3].innerHTML = num2;
						mytab.rows[pos].cells[4].innerHTML = num3;
						if (num2 <= 0 || num3 <= 0) {
							lingshi_node.element.Mshijianpian = shijianpian;
							var PID = lingshi_node.element.Mpid;
							var lingshi_thread = Mqueue1.FinAndDel(PID).element;
							mytab.deleteRow(pos);
							if (num3 > 0) {
								Mqueue2.push(lingshi_thread);
								creatrow("onthread_table", inthread2onthread);
							}
						}
						lingshi_node.element.jishi = 0;
					}
					pos++;
					lingshi_node = lingshi_node.next;
				}

			}

			this.FinAndDel = function (Pid) {
				var lingshi_node = front;
				var prenode = front;
				while (lingshi_node) {
					if (lingshi_node == front) {
						if (lingshi_node.element.Mpid == Pid) {
							return this.pop();
						}
						else {
							lingshi_node = lingshi_node.next;
							continue;
						}
					}
					if (lingshi_node != front && lingshi_node != rear) {
						if (lingshi_node.element.Mpid == Pid) {
							var mynode = lingshi_node.next;
							prenode.next = mynode;
							lingshi_node.next = null;
							length--;
							// alert(lingshi_node.element.Mpid + "被删除" + "当前队列长度为" + length);
							return lingshi_node;
						}

					}
					if (lingshi_node == rear) {
						if (lingshi_node.element.Mpid == Pid) {
							prenode.next = null;
							rear = prenode;
							length--;
							return lingshi_node;
						}
					}
					prenode = prenode.next;
					lingshi_node = lingshi_node.next;

				}
				alert("本队列中没有进程" + Pid);
				return false;
			}
		}

		function delthreadrow(threadname, Pid) {
			var mytab = document.getElementById(threadname);
			for (var i = 0; i < mytab.rows.length; i++) {
				var num1 = parseInt(mytab.rows[i].cells[1].innerText);
				if (num1 == Pid) {
					mytab.deleteRow(i);
					break;
				}
			}
		}

		function creatrow(threadname, Action) {
			var tr = document.createElement("tr");
			var Mcheckbox = document.createElement("td");
			var Mpid = document.createElement("td");
			var Mname = document.createElement("td");
			var Mtimeslice = document.createElement("td");
			var Mtime = document.createElement("td");
			var lingshi_queue;
			tr.appendChild(Mcheckbox);
			tr.appendChild(Mpid);
			tr.appendChild(Mname);
			if (threadname == "inthread_table") {
				tr.appendChild(Mtimeslice);
			}
			if (threadname == "inthread_table" || threadname == "onthread_table") {
				tr.appendChild(Mtime);
			}

			if (Action == insertonthread || Action == inthread2onthread || Action == outthread2onthread) {
				lingshi_queue = Mqueue2;
			}
			else if (Action == onthread2inthread) {
				lingshi_queue = Mqueue1;
			}
			else {
				lingshi_queue = Mqueue3;
			}
			var checkbox = document.createElement("input");
			checkbox.setAttribute("type", "checkbox");
			if (threadname == "inthread_table") {
				checkbox.setAttribute("name", "inthread_checkbox");
			}
			else if (threadname == "onthread_table") {
				checkbox.setAttribute("name", "onthread_checkbox");
			}
			else {
				checkbox.setAttribute("name", "outthread_checkbox");
			}

			var textpid = document.createTextNode(lingshi_queue.getRear().element.Mpid);
			var textname = document.createTextNode(lingshi_queue.getRear().element.Mname);
			var textshijianpian = document.createTextNode(lingshi_queue.getRear().element.Mshijianpian);
			var texttime = document.createTextNode(lingshi_queue.getRear().element.Mtime);

			Mcheckbox.appendChild(checkbox);
			Mpid.appendChild(textpid);
			Mname.appendChild(textname);
			if (threadname == "inthread_table") {
				Mtimeslice.appendChild(textshijianpian);
			}
			if (threadname == "inthread_table" || threadname == "onthread_table") {
				Mtime.appendChild(texttime)
			}
			document.getElementById(threadname).appendChild(tr);
		}

		function timer() {
			var mytab1 = document.getElementById("inthread_table");
			var mytab2 = document.getElementById("onthread_table");
			if (mytab1.rows.length < Cpu && mytab2.rows.length > 0) {
				mytab2.deleteRow(0);
				Mqueue1.push(Mqueue2.pop().element);
				creatrow("inthread_table", onthread2inthread);
			}
			if (mytab1.rows.length > 0) {
				Mqueue1.traver();
			}

		}

		$(document).ready(function () {
			var myVar = setInterval(function () { timer() }, zhenlu);

			$("#creat").hide();
			$("#creat_fram").hide();
			$("#init_thread").click(function () {
				$("#init_thread").hide();
				$("#creat").show();
			});
			$("#queding_button").click(function () {
				$("#creat").hide();
				$("#init_thread").show();
			})
			$("#quxiao_button").click(function () {
				$("#creat").hide();
				$("#init_thread").show();
			})
			$("#shezhi_item").click(function () {
				$("#mian_fram").hide();
				$("#creat_fram").show();
			})
			$("#zhuye_item").click(function () {
				$("#creat_fram").hide();
				$("#mian_fram").show();

			})

			document.getElementById("queding_button").onclick = function () {
				// alert(rongliang)
				// alert(Mqueue1.size() + Mqueue2.size() + Mqueue3.size());
				if (Mqueue1.size() + Mqueue2.size() + Mqueue3.size() < rongliang) {
					var name = document.getElementById("input_name").value;
					var time = document.getElementById("input_shijian").value;
					var thead = new Mythread(pid_init, name, time);
					Mqueue2.push(thead);
					pid_init = pid_init + 1;
					creatrow("onthread_table", insertonthread);
				}
				else {
					alert("已创建进程数量超过进程池容量:" + rongliang);
				}
			}

			document.getElementById("summit_but").onclick = function () {
				zhongduan = parseInt(document.getElementById("shizhong_zhongduan").value);
				shijianpian = parseInt(document.getElementById("jincheng_shijianpian").value);
				rongliang = parseInt(document.getElementById("jincheng_rongliang").value);
				Cpu = parseInt(document.getElementById("Cpu_shuliang").value);
				clearInterval(myVar);
				myVar = setInterval(function () { timer() }, zhenlu);

				alert(zhongduan + "" + shijianpian + "" + rongliang + "" + Cpu);
			}

			document.getElementById("block_inthread").onclick = function () {
				var mytab = document.getElementById("inthread_table");
				var inthread_check_Arr = document.getElementsByName("inthread_checkbox");
				// alert(inthread_check_Arr.length);
				for (var i = 0; i < inthread_check_Arr.length; i++) {
					if (inthread_check_Arr[i].checked) {
						var pid = parseInt(mytab.rows[i].cells[1].innerText)
						// alert(pid)
						delthreadrow("inthread_table", pid);
						var mynode = Mqueue1.FinAndDel(pid);
						if (mynode == false) {
							alert("block_inthread:" + pid + "删除失败");
						}
						mynode.element.Mshijianpian = shijianpian;
						Mqueue3.push(mynode.element);
						creatrow("outthread_table", inthread2outthread);
					}
				}

			}

			document.getElementById("del_inthread").onclick = function () {
				var mytab = document.getElementById("inthread_table");
				var inthread_check_Arr = document.getElementsByName("inthread_checkbox");
				// alert(inthread_check_Arr.length);
				for (var i = 0; i < inthread_check_Arr.length; i++) {
					if (inthread_check_Arr[i].checked) {
						var pid = parseInt(mytab.rows[i].cells[1].innerText)
						// alert(pid)
						delthreadrow("inthread_table", pid);
						var mynode = Mqueue1.FinAndDel(pid);
						if (mynode == false) {
							alert("del_inthread:" + pid + "删除失败");
						}
						return true;
					}
				}

			}

			document.getElementById("del_onthread").onclick = function () {
				var mytab = document.getElementById("onthread_table");
				var onthread_check_Arr = document.getElementsByName("onthread_checkbox");
				// alert(inthread_check_Arr.length);
				for (var i = 0; i < onthread_check_Arr.length; i++) {
					if (onthread_check_Arr[i].checked) {
						var pid = parseInt(mytab.rows[i].cells[1].innerText)
						// alert(pid)
						delthreadrow("onthread_table", pid);
						var mynode = Mqueue2.FinAndDel(pid);
						if (mynode == false) {
							alert("del_onthread:" + pid + "删除失败");
						}
						return true;
					}
				}

			}

			document.getElementById("wake_outthread").onclick = function () {
				var mytab = document.getElementById("outthread_table");
				var outthread_check_Arr = document.getElementsByName("outthread_checkbox");
				// alert(inthread_check_Arr.length);
				for (var i = 0; i < outthread_check_Arr.length; i++) {
					if (outthread_check_Arr[i].checked) {
						var pid = parseInt(mytab.rows[i].cells[1].innerText)
						// alert(pid)
						delthreadrow("outthread_table", pid);
						var mynode = Mqueue3.FinAndDel(pid);
						if (mynode == false) {
							alert("wake_outthread:" + pid + "删除失败");
						}
						Mqueue2.push(mynode.element);
						creatrow("onthread_table", outthread2onthread);
						return true;
					}
				}

			}

			document.getElementById("del_outthread").onclick = function () {
				var mytab = document.getElementById("outthread_table");
				var outthread_check_Arr = document.getElementsByName("outthread_checkbox");
				// alert(inthread_check_Arr.length);
				for (var i = 0; i < outthread_check_Arr.length; i++) {
					if (outthread_check_Arr[i].checked) {
						var pid = parseInt(mytab.rows[i].cells[1].innerText)
						// alert(pid)
						delthreadrow("outthread_table", pid);
						var mynode = Mqueue3.FinAndDel(pid);
						if (mynode == false) {
							alert("del_outthread:" + pid + "删除失败");
						}
						return true;
					}
				}

			}

		});



